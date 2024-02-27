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
    resetarSelecao(radios)
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
    ocultarBotaoEsecao()
    resetarSelecao(radios)
})

const radios = document.querySelectorAll('input[type="radio"]')
radios.forEach(radio => {
    radio.addEventListener('change', () => {
        const label = document.querySelector(`label[for="${radio.id}"]`)
        label.classList.add('selecionado')
        radios.forEach(radioAtual => {
            if (radioAtual !== radio) {
                const outroLabel = document.querySelector(`label[for="${radioAtual.id}"]`)
                outroLabel.classList.remove('selecionado')
            }
        })
    })
})

const resetarSelecao = (radios) => {
    radios.forEach(radio => {
        radios.forEach(radioAtual => {
            if (radioAtual !== radio) {
                const outroLabel = document.querySelector(`label[for="${radioAtual.id}"]`)
                outroLabel.classList.remove('selecionado')
            }
        })
    })
}

const cart = []

const btnAddCarrinho = document.querySelector('.btn__add_cart')
btnAddCarrinho.addEventListener('click', () => {
    const produto = {
        id: document.querySelector('.detalhes span').innerHTML,
        nome: document.querySelector('.detalhes h4').innerHTML,
        modelo: document.querySelector('.detalhes h5').innerHTML,
        preco: document.querySelector('.detalhes h6').innerHTML,
        tamanho: document.querySelector('input[type="radio"][name="size"]:checked').value
    }
    cart.push(produto)
    ocultarBotaoEsecao()
    sectionHero.style.display = 'none'
    sectionCarrinho.style.display = 'block'

    atualizarCarrinho(cart)
    atualizarNumeroItens()
})

const corpoTabela = document.querySelector('.carrinho tbody')

const atualizarCarrinho = (cart) => {
    corpoTabela.innerHTML = ""
    cart.map(produto => {
        corpoTabela.innerHTML += `
            <tr>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td class='coluna_tamanho'>${produto.tamanho}</td>
                <td class='coluna_preco'>${produto.preco}</td>
                <td class='coluna_apagar'>
                    <span class="material-symbols-outlined" data-id="${produto.id}">
                        delete
                    </span>
                </td>
            </tr>
        ` 
    })

    const total = cart.reduce( (valorAcumulado, item) => {
        return valorAcumulado + parseFloat(item.preco.replace('R$&nbsp;','').replace('.','').replace(',','.'))
    }, 0)
    document.querySelector('.coluna_total').innerHTML = formatCurrency(total)

    acaoBotaoApagar()
}

const numeroItens = document.querySelector('.numero_itens')
numeroItens.style.display = 'none'
const atualizarNumeroItens = () => {
    (cart.length > 0) ? numeroItens.style.display = 'block' : numeroItens.style.display = 'none'
    numeroItens.innerHTML = cart.length
}

const acaoBotaoApagar = () => {
    const botaoApagar = document.querySelectorAll('.coluna_apagar span')
    botaoApagar.forEach( botao =>{
        botao.addEventListener('click', () => {
            const id = botao.getAttribute('data-id')
            const posicao = cart.findIndex( item => item.id == id )
            cart.splice(posicao, 1)
            atualizarCarrinho(cart)
        })
    })
    atualizarNumeroItens()
}

const spanId = document.querySelector('.detalhes span')
spanId.style.display = 'none'