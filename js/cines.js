import { db, collection, getDocs, query, where } from './firebase-config.js';

const getCines = async () => {
    const querySnapshot = await getDocs(collection(db, "cines"));
    
    if (!querySnapshot.empty) {
        let html = `<br/><h1>Nuestros Cines</h1><br/>`
        querySnapshot.forEach((doc) => {
            const cine = doc.data(); 
            html += `				
				<div class="contenido-cine">
	        	    <img src="img/cine/${cine.id}.1.jpg" width="227" height="170"/>
            	   	<div class="datos-cine">
       				   	<h4>${cine.RazonSocial}</h4><br/>
                		<span>${cine.Direccion} - ${cine.Detalle}<br/><br/>Teléfono: ${cine.Telefonos}</span>
                	</div>
                	<br/>
                	<a href="cine.html?id=${cine.id}">
                		<img src="img/varios/ico-info2.png" width="150" height="40"/>
                	</a>
				</div>
            `
        });
        document.getElementById('contenido-interno').innerHTML = html
    }
}
getCines()