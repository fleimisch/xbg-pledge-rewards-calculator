
export const generateCSVFile = (csvString: string) => {
	// Create a blob from the CSV string
	const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
	// Generate a URL for the blob
	const url = URL.createObjectURL(blob);

	// Create a temporary anchor element and trigger a download
	const a = document.createElement('a');
	a.href = url;
	a.download = 'report.csv'; // Specify the filename for the download
	document.body.appendChild(a); // Append the anchor to the body
	a.click(); // Programmatically click the anchor to trigger the download
	document.body.removeChild(a); // Clean up by removing the anchor from the body

	// Release the created Blob URL
	URL.revokeObjectURL(url);
};