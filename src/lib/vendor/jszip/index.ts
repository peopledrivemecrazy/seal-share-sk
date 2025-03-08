import JSZip from 'jszip';

export const zipDocuments = async (documents: Record<string, File>, filename: string) => {
	const zip = new JSZip();
	const folder = zip.folder(filename);
	for (const file of Object.values(documents)) {
		const data = await file.arrayBuffer();
		folder!.file(file.name, data);
	}
	const blob = await zip.generateAsync({ type: 'blob' });
	return blob;
};
