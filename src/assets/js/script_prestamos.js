const slider = document.querySelector('#slider');
const pct = document.querySelector('.pct');
const pct02 = document.querySelector('.pct02');
const pctIndicator = document.querySelector('#pct-ind')
slider.oninput = () => {
	pct.textContent = `${slider.value},000 MXN`
	pct02.textContent = `${slider.value},000 MXN`
	
	// valores
	const p = ( 1 - slider.value / 100 ) * (2 * (22 / 7) * 40);
	pctIndicator.style = `
		stroke-dashoffset: ${p};    
	`
}