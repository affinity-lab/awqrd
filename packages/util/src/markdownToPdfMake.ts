interface Token {
	type: 'text' | 'bold' | 'italic' | 'both';
	content: string;
}

function tokenizeMarkdown(input: string): Token[] {
	const tokens: Token[] = [];
	const regex = /(\*\*\*|___|\*\*|__|\*|_)(.*?)\1/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(input)) !== null) {
		const [fullMatch, marker, content] = match;
		const startIndex = match.index;

		// Add any preceding text as a 'text' token
		if (startIndex > lastIndex) {
			tokens.push({
				type: 'text',
				content: input.slice(lastIndex, startIndex),
			});
		}

		// Determine the type of the token based on the marker
		let type: 'bold' | 'italic' | 'both';
		if (marker === '***' || marker === '___') {
			type = 'both';
		} else if (marker === '**' || marker === '__') {
			type = 'bold';
		} else {
			type = 'italic';
		}

		tokens.push({ type, content });
		lastIndex = regex.lastIndex;
	}

	// Add any remaining text as a 'text' token
	if (lastIndex < input?.length || 0) {
		tokens.push({
			type: 'text',
			content: input.slice(lastIndex),
		});
	}

	return tokens;
}

export function markdownToPdfMake(markdown: string): any {
	const tokens = tokenizeMarkdown(markdown);
	const pdfContent: any[] = [];

	tokens.forEach(token => {
		if (token.type === 'bold') {
			pdfContent.push({ text: token.content, bold: true });
		} else if (token.type === 'italic') {
			pdfContent.push({ text: token.content, italics: true });
		} else if (token.type === 'both') {
			pdfContent.push({ text: token.content, italics: true, bold: true});
		} else {
			pdfContent.push({ text: token.content });
		}
	});

	return pdfContent;
}