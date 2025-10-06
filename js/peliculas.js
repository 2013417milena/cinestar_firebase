import { db, collection, getDocs, query, where } from './firebase-config.js';

const getPeliculas = async () => {
    const id = (new URLSearchParams(window.location.search)).get('id')
    
    let idEstado = null;
    
    
    if (id === 'cartelera') {
        idEstado = '1'; 
    } else if (id === 'estrenos') {
        idEstado = '2'; 
    }

    if (!idEstado) {
        document.getElementById('contenido-interno').innerHTML = `<p>Categoría de películas no válida.</p>`
        return;
    }

    const q = query(collection(db, "peliculas"), where("idEstado", "==", idEstado));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const peliculas = [];
        querySnapshot.forEach((doc) => {
            peliculas.push(doc.data());
        });

        let html = ``
        peliculas.forEach(pelicula => {
            html += `				
				<div class="contenido-pelicula">
					<div class="datos-pelicula">
						<h2>${pelicula.Titulo}</h2><br/>
						<p>${pelicula.Sinopsis}</p>
						<br/>
                       	<div class="boton-pelicula"> 
                       		<a href="pelicula.html?id=${pelicula.id}" >
                       			<img src="img/varios/btn-mas-info.jpg" width="120" height="30" alt="Ver info"/>
                       		</a>
               			</div>
               			<div class="boton-pelicula"> 
               				<a href="https://www.youtube.com/v/${pelicula.Link}" target=_blank  onclick="return hs.htmlExpand(this, { objectType: 'iframe' } )" >
               					<img src="img/varios/btn-trailer.jpg" width="120" height="30" alt="Ver trailer"/>
               				</a>
                        </div> 
					</div>
					<img src="img/pelicula/${pelicula.id}.jpg" width="160" height="226"/><br/><br/>
				</div>
            `
        });
        document.getElementById('contenido-interno').innerHTML = html
    } else {
        document.getElementById('contenido-interno').innerHTML = `<p>No se encontraron películas para esta categoría.</p>`
    }
}
getPeliculas()