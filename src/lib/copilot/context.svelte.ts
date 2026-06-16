// The current page's lecture context, set by the page (e.g. DayView) so the
// assistant always "knows" the lecture it's looking at.
class CopilotContext {
	label = $state(''); // e.g. "Алго · Графы · Теория"
	title = $state('');
	text = $state(''); // serialized page material (theory, glossary, lab)

	set(label: string, title: string, text: string) {
		this.label = label;
		this.title = title;
		this.text = text;
	}
	clear() {
		this.label = '';
		this.title = '';
		this.text = '';
	}
	get has(): boolean {
		return !!this.text;
	}
}

export const ctx = new CopilotContext();
