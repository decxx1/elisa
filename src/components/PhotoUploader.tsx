import { Icon } from '@iconify/react';
import { useState, type ChangeEvent, type FormEvent } from 'react';

const MAX_BYTES = 50 * 1024 * 1024;

function formatBytes(bytes: number) {
	return `${(bytes / 1024 / 1024).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

export default function PhotoUploader() {
	const [uploaderName, setUploaderName] = useState('');
	const [files, setFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState({ current: 0, total: 0 });
	const [message, setMessage] = useState<{ type: 'idle' | 'success' | 'error'; text: string }>({ type: 'idle', text: '' });

	function addFiles(event: ChangeEvent<HTMLInputElement>) {
		const incoming = Array.from(event.target.files ?? []);
		const valid = incoming.filter((file) => file.size <= MAX_BYTES);
		const oversized = incoming.length - valid.length;
		setFiles((current) => {
			const known = new Set(current.map((file) => `${file.name}:${file.size}:${file.lastModified}`));
			return [...current, ...valid.filter((file) => !known.has(`${file.name}:${file.size}:${file.lastModified}`))];
		});
		setMessage(oversized ? { type: 'error', text: `${oversized} foto${oversized === 1 ? '' : 's'} supera${oversized === 1 ? '' : 'n'} el máximo de 50 MB.` } : { type: 'idle', text: '' });
		event.target.value = '';
	}

	async function uploadPhotos(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const cleanName = uploaderName.trim();
		if (cleanName.length < 2) {
			setMessage({ type: 'error', text: 'Escribí tu nombre antes de continuar.' });
			return;
		}
		if (!files.length) {
			setMessage({ type: 'error', text: 'Elegí o tomá al menos una foto.' });
			return;
		}

		setUploading(true);
		setProgress({ current: 0, total: files.length });
		const failed: File[] = [];
		let uploaded = 0;

		for (const [index, file] of files.entries()) {
			setProgress({ current: index + 1, total: files.length });
			try {
				const body = new FormData();
				body.append('uploaderName', cleanName);
				body.append('photo', file);
				const response = await fetch('/api/photos', { method: 'POST', body });
				const data = await response.json();
				if (!response.ok) throw new Error(data.error ?? 'No pudimos guardar la foto.');
				uploaded += 1;
			} catch {
				failed.push(file);
			}
		}

		setFiles(failed);
		setUploading(false);
		setMessage(
			failed.length
				? { type: 'error', text: `Se guardaron ${uploaded} foto${uploaded === 1 ? '' : 's'}; ${failed.length} no pudieron subirse. Podés intentar nuevamente.` }
				: { type: 'success', text: `${uploaded} foto${uploaded === 1 ? ' quedó guardada' : 's quedaron guardadas'} en calidad original. ¡Gracias!` }
		);
	}

	return (
		<form className="mt-10" onSubmit={uploadPhotos}>
			<label className="block font-ui text-[10px] font-bold uppercase tracking-[.18em] text-ivory/60">
				Tu nombre y/o apellido
				<input
					className="mt-3 block w-full border border-ivory/20 bg-ivory/5 px-4 py-3 font-serif text-2xl text-ivory outline-none transition placeholder:text-ivory/25 focus:border-gold"
					value={uploaderName}
					onChange={(event) => setUploaderName(event.target.value.slice(0, 60))}
					placeholder="Tu nombre"
					autoComplete="name"
					required
				/>
			</label>

			<div className="mt-7 grid gap-3 sm:grid-cols-2">
				<label className="group flex cursor-pointer items-center gap-4 border border-gold/50 bg-gold px-5 py-4 text-ink transition hover:bg-ivory">
					<Icon icon="lucide:images" width="22" />
					<span>
						<span className="block font-ui text-[10px] font-bold uppercase tracking-[.2em]">Elegir de la galería</span>
						<span className="mt-1 block font-ui text-[10px] text-ink/60">Podés seleccionar varias</span>
					</span>
					<input className="sr-only" type="file" accept="image/*,.heic,.heif" multiple onChange={addFiles} disabled={uploading} />
				</label>
				<label className="group flex cursor-pointer items-center gap-4 border border-gold/50 px-5 py-4 text-gold transition hover:bg-gold hover:text-ink">
					<Icon icon="lucide:camera" width="22" />
					<span>
						<span className="block font-ui text-[10px] font-bold uppercase tracking-[.2em]">Tomar una foto</span>
						<span className="mt-1 block font-ui text-[10px] opacity-60">Abrir la cámara del dispositivo</span>
					</span>
					<input className="sr-only" type="file" accept="image/*" capture="environment" onChange={addFiles} disabled={uploading} />
				</label>
			</div>

			{files.length > 0 && (
				<div className="mt-7 border border-ivory/15 bg-ivory/[.04] p-4">
					<div className="flex items-center justify-between gap-3">
						<p className="font-ui text-[10px] font-bold uppercase tracking-[.2em] text-gold">{files.length} {files.length === 1 ? 'foto lista' : 'fotos listas'}</p>
						{!uploading && <button className="font-ui text-[9px] font-bold uppercase tracking-[.16em] text-ivory/45 hover:text-gold" type="button" onClick={() => setFiles([])}>Quitar todas</button>}
					</div>
					<ul className="mt-3 max-h-48 space-y-2 overflow-y-auto">
						{files.map((file, index) => (
							<li className="flex items-center justify-between gap-3 border-t border-ivory/10 pt-2 font-ui text-xs text-ivory/65" key={`${file.name}-${file.size}-${file.lastModified}`}>
								<span className="min-w-0 truncate">{file.name}</span>
								<span className="shrink-0 text-ivory/35">{formatBytes(file.size)}</span>
								{!uploading && <button className="shrink-0 text-ivory/40 hover:text-gold" type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Quitar ${file.name}`}><Icon icon="lucide:x" width="14" /></button>}
							</li>
						))}
					</ul>
				</div>
			)}

			<div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
				<button className="inline-flex items-center justify-center gap-3 bg-gold px-6 py-4 font-ui text-xs font-bold uppercase tracking-[.2em] text-ink transition hover:bg-ivory disabled:cursor-wait disabled:opacity-60" type="submit" disabled={uploading || !files.length}>
					{uploading ? `Subiendo ${progress.current} de ${progress.total}` : 'Subir'}
					<Icon icon={uploading ? 'lucide:loader-circle' : 'lucide:upload'} className={uploading ? 'animate-spin' : ''} width="17" />
				</button>
				<p className={`font-ui text-xs leading-5 ${message.type === 'error' ? 'text-red-300' : message.type === 'success' ? 'text-gold' : 'text-ivory/45'}`} aria-live="polite">
					{message.text || ''}
				</p>
			</div>
		</form>
	);
}
