const slider = document.querySelector('#slider');
const pct = document.querySelector('.pct');
const pct02 = document.querySelector('.pct02');
const pctIndicator = document.querySelector('#pct-ind')
slider.oninput = () => {
	pct.textContent = `${slider.value},000 MXN`
	pct02.textContent = `${slider.value},000 MXN`
	
	// valores
	const p = ( 1 - slider.value / 100 ) * (2 * (3.142857142) * 40);
	pctIndicator.style = `
		stroke-dashoffset: ${p};    
	`
}



const slider_plazos = document.querySelector('#slider_plazos');
const pct_plazos = document.querySelector('.pct_plazos');
const pct_plazos02 = document.querySelector('.pct_plazos02');
const pctIndicator_plazos = document.querySelector('#pct_plazos-ind')
slider_plazos.oninput = () => {
	pct_plazos.textContent = `${slider_plazos.value} Quincenas`
	pct_plazos02.textContent = `${slider_plazos.value} Quincenas`
	
	// valores
	const p = ( 1 - slider_plazos.value / 100) * (2 * (3.142857142) * 40);
	pctIndicator_plazos.style = `
		stroke-dashoffset: ${p};    
	`
}
