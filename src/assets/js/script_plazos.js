const slider = document.querySelector('#slider_plazos');
const pct_plazos = document.querySelector('.pct_plazos');
const pct_plazos02 = document.querySelector('.pct_plazos02');
const pctIndicator_plazos = document.querySelector('#pct_plazos-ind')
slider.oninput = () => {
	pct_plazos.textContent = `${slider.value},000 MXN`
	pct_plazos02.textContent = `${slider.value},000 MXN`
	
	// valores
	const p = ( 1 - slider.value / 100 ) * (2 * (22 / 7) * 40);
	pctIndicator_plazos.style = `
		stroke-dashoffset: ${p};    
	`
}


