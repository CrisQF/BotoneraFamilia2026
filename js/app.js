/* ===================================================================
   Botonera de Sonidos - logica
   -------------------------------------------------------------------
   Decisiones que importan:

   - Cada boton controla SU audio. Se pueden usar varios a la vez: un tap
     reproduce, el siguiente lo detiene, y si lo dejas termina solo.
   - El audio se crea recien en el primer tap. Con 30+ archivos, cargarlos
     todos al inicio haria la pagina lenta y gastaria datos de mas.
   - La busqueda ignora acentos y mayusculas: "rosad" encuentra
     "Rosa de Guadalupe" y "SANTO" encuentra "santo".
   =================================================================== */

/** Cada audio vivo en la pagina, por nombre de archivo. */
const audios = {};

/** Normaliza texto para comparar: sin acentos y en minusculas. */
function normalizar(texto) {
	return texto
		.toString()
		.normalize('NFD') // separa la letra de su tilde
		.replace(/[\u0300-\u036f]/g, '') // y aqui las quita
		.toLowerCase()
		.trim();
}

/** Separa 'archivo' o ['archivo', 'Etiqueta'] en {archivo, etiqueta}. */
function interpretar(entrada) {
	if (Array.isArray(entrada)) {
		return { archivo: entrada[0], etiqueta: entrada[1] };
	}
	return { archivo: entrada, etiqueta: entrada };
}

/**
 * Devuelve el nombre visible de un sonido.
 * 'rosaDeGuadalupe' -> 'Rosa De Guadalupe'
 */
function prettificar(nombre) {
	return nombre
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2') // separation en camelCase
		.replace(/[_-]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Crea (o reutiliza) el elemento de audio y lo reproduce. */
function reproducir(archivo) {
	if (!audios[archivo]) {
		const audio = new Audio('audio/' + archivo + '.mp3');
		audio.preload = 'auto';
		// Cuando termina solo, el boton debe dejar de verse activo.
		audio.addEventListener('ended', () => {
			marcarActivo(archivo, false);
		});
		// Si el archivo no existe o esta corrupto, no romper la pagina.
		audio.addEventListener('error', () => {
			marcarActivo(archivo, false);
			aviso('No se pudo cargar "' + archivo + '.mp3"');
		});
		audios[archivo] = audio;
	}

	const audio = audios[archivo];

	if (audio.paused) {
		const intento = audio.play();
		// En iOS, play() devuelve una promesa que puede rechazar si el
		// navegador exige un gesto del usuario. Sin esto sale un error
		// feo en consola aunque el boton funcione.
		if (intento && typeof intento.catch === 'function') {
			intento.catch(() => {
				marcarActivo(archivo, false);
			});
		}
		marcarActivo(archivo, true);
	} else {
		audio.pause();
		// Vuelve al inicio: si lo vuelven a tocar, suena desde el principio
		// en vez de continuar donde se quedo.
		audio.currentTime = 0;
		marcarActivo(archivo, false);
	}
}

function marcarActivo(archivo, activo) {
	const boton = document.querySelector('[data-archivo="' + archivo + '"]');
	if (boton) {
		boton.classList.toggle('sonando', activo);
		boton.setAttribute('aria-pressed', activo ? 'true' : 'false');
	}
}

function aviso(texto) {
	const destino = document.getElementById('contador');
	if (destino) {
		destino.textContent = texto;
	}
}

/** Dibuja los botones. `filtro` vacio muestra todos. */
function pintar(filtro) {
	const contenedor = document.getElementById('botones');
	const contador = document.getElementById('contador');
	const vacio = document.getElementById('vacio');
	const criterio = normalizar(filtro || '');

	contenedor.innerHTML = '';

	const lista = SONIDOS.map(interpretar).filter((sonido) => {
		if (!criterio) return true;
		// Se busca por la etiqueta visible y tambien por el nombre del
		// archivo, para que "chavo" encuentre 'chavoIntro'.
		return (
			normalizar(sonido.etiqueta).includes(criterio) ||
			normalizar(sonido.archivo).includes(criterio)
		);
	});

	lista.forEach((sonido) => {
		const boton = document.createElement('button');
		boton.className = 'boton';
		boton.type = 'button';
		boton.textContent = sonido.etiqueta;
		boton.dataset.archivo = sonido.archivo;
		boton.setAttribute('aria-pressed', 'false');
		boton.addEventListener('click', () => reproducir(sonido.archivo));
		contenedor.appendChild(boton);
	});

	const total = SONIDOS.length;
	if (!total) {
		contador.textContent = '';
	} else if (criterio) {
		contador.textContent =
			lista.length + ' de ' + total + ' sonidos';
	} else {
		contador.textContent = total + ' sonidos';
	}

	vacio.style.display = lista.length ? 'none' : 'block';
	if (!lista.length) {
		vacio.querySelector('strong').textContent =
			'Nada coincide con "' + filtro + '"';
	}
}

function iniciar() {
	const input = document.getElementById('buscar');

	pintar('');

	input.addEventListener('input', () => pintar(input.value));

	// La "/" enfoca el buscador. Comodo cuando hay muchos sonidos.
	document.addEventListener('keydown', (evento) => {
		if (evento.key === '/' && document.activeElement !== input) {
			evento.preventDefault();
			input.focus();
		}
		// Escape limpia y sale del buscador.
		if (evento.key === 'Escape' && document.activeElement === input) {
			input.value = '';
			pintar('');
			input.blur();
		}
	});
}

document.addEventListener('DOMContentLoaded', iniciar);
