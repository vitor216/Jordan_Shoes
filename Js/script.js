const botaoVoltar = document.querySelector('.voltar')
const sectionDetalhesProduto = document.querySelector('.Produto__detalhes')
const sectionProdutos = document.querySelector('.produtos')
const sectionHero = document.querySelector('.hero')

const ocultarBotaoEsecao = () => {
    botaoVoltar.style.display = 'none'
    sectionDetalhesProduto.style.display = 'none'
}

ocultarBotaoEsecao()

const formatCurrency = (number) => {
    return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}
const getProducts = async () => {
    const response = await fetch('Js/products.json')
    const data = await response.json()
    return data
}
const generateCard = async () => {
    const products = await getProducts()
    products.map(product => {
        let card = document.createElement('div')
        card.id = product.id
        card.classList.add('card__produto')
        card.innerHTML = `
<figure>
        <img src="Imagens/${product.image}" alt="${product.product_name}" />
    </figure>
    <div class="card__produto_detalhes">
        <h4>${product.product_name}</h4>
        <h5>${product.product_model}</h5>
    </div>
    <h6>${formatCurrency(product.price)}</h6>
        `
    const listaProdutos = document.querySelector('.lista__produtos')
    listaProdutos.appendChild(card)
    preencherCard(card, products)
    })
}
generateCard()

botaoVoltar.addEventListener('click', () => {
    sectionProdutos.style.display = 'flex'
    ocultarBotaoEsecao()
})

const preencherDadosProduto = (product) => {
    const images = document.querySelectorAll('.Produto__detalhes_imagens figure img')
    const imagesArray = Array.from(images)
    imagesArray.map( image => {
        image.src = `./Imagens/${product.image}`
    })
    

    document.querySelector('.detalhes span').innerHTML = product.id
    document.querySelector('.detalhes h4').innerHTML = product.product_name
    document.querySelector('.detalhes h5').innerHTML = product.product_model
    document.querySelector('.detalhes h6').innerHTML = formatCurrency(product.price)

}

const details = document.querySelector('details')

details.addEventListener('toggle', () => {
    const summary = document.querySelector('summary')
    summary.classList.toggle('icone-expandir')
    summary.classList.toggle('icone-recolher')
})

const preencherCard = (card, products) => {
    card.addEventListener('click', (e) => {
        sectionProdutos.style.display = 'none'
        botaoVoltar.style.display = 'block'
        sectionDetalhesProduto.style.display = 'grid'

        const cardClicado = e.currentTarget
        const idProduto = cardClicado.id
        const produtoClicado = products.find( product => product.id == idProduto )

        preencherDadosProduto(produtoClicado)
        })
}

const btnCarrinho = document.querySelector('.btn__carrinho .icone')
const sectionCarrinho = document.querySelector('.carrinho')

btnCarrinho.addEventListener('click', () => {
    sectionCarrinho.style.display = 'block'
    sectionHero.style.display = 'none'
    sectionProdutos.style.display = 'none'
    sectionDetalhesProduto.style.display = 'none'
    botaoVoltar.style.display = 'none'
})

const btnHome = document.querySelector('.link_home')
btnHome.addEventListener('click', (e) => {
    e.preventDefault()
    sectionCarrinho.style.display = 'none'
    sectionHero.style.display = 'flex'
    sectionProdutos.style.display = 'flex'
    sectionDetalhesProduto.style.display = 'none'
    botaoVoltar.style.display = 'none'
})