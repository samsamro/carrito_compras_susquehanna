import _ from 'lodash';
import './estilo.css';
import Imagen from './logo.png';
import Datos from './datos.csv';
import yaml from './datos.yaml';
import './estilo.scss';

const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer =document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
//fragment memoria volatil
const fragment = document.createDocumentFragment()

let carrito = {}

//llamada a fetch
document.addEventListener('DOMContentLoaded',() =>{
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click',e =>{
    addCarrito(e)
})

items.addEventListener('click',e =>{
    btnAccion(e)
})
//acceso a los datos de api.json
const fetchData = async () =>{
    try {
        const res= await fetch('https://fakestoreapi.com/products')
        const data= await res.json()
        pintarCards(data)
    } catch (error){
        console.log(error)
    }
}

const pintarCards = data =>{
    console.log(data)
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.price
        templateCard.querySelector('img').setAttribute("src",producto.image)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
        console.log(producto)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    //console.log(e.target)
    //console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)

    }
    e.stopPropagation()
}

//crear carrito
const setCarrito = objeto => {
    const producto ={
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        price: objeto.querySelector('p').textContent,
        cantidad:1
    }
    console.log(objeto)
    //aumentar cantidad producto ya seleccionado
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad=carrito[producto.id].cantidad + 1
    }
    //copia de producto 
    carrito[producto.id] = {...producto}
    pintarCarrito()

}

//se ve el carrito
const pintarCarrito = () => {
    //console.log(carrito)
    //inicializa en cero/blanco
    items.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.price
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()
    //respaldo de productos en el carrito
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () =>{
    //inicializa en cero/blanco
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    //acumulador precios: total de compra
    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad, 0)
    const nPrice = Object.values(carrito).reduce((acc,{cantidad,price}) => acc + cantidad * price, 0)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelectorAll('span')[0].textContent = nPrice
    console.log(nPrice)
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment) 
    //boton vaciar
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click',()=>{
        carrito ={}
        pintarCarrito()
    })
}

const btnAccion = e=>{
    //Aumentar productos
    if (e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        //producto.cantidad++
        carrito[e.target.dataset.id]= {...producto}
        pintarCarrito()
    }
    if (e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad ===0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}

//caída del servidor
if ('serviceWorker' in navigator){
    window.addEventListener('load',()=>{
        navigator.serviceWorker.register('./serviceWorker.js').then(registration => {
            console.log("SW registrado", registration);
        }).catch(err => {
            console.log("SW no registrado", err)
        });
    });
}

//integrar a la pag html un bloque div con texto de saludo
function componente(){
    const elemento=document.createElement('div')
    //lodash biblioteca externa
    elemento.innerHTML=_.join(['Fin','Webpack'],' ');
    elemento.classList.add('hola');
    const miImagen = new Image();
    miImagen.src=Imagen;
    elemento.appendChild(miImagen);
    console.log(Datos);
    console.log(yaml.title);
    return elemento;
}
document.body.appendChild(componente())