import { formatCurrency } from './utils.js'

const botaoVoltar = document.querySelector('.voltar')
const sectionDetalhesProduto = document.querySelector('.Produto__detalhes')
const sectionProdutos = document.querySelector('.produtos')
const sectionHero = document.querySelector('.hero')

const ocultarElemento = (elemento) => {
    elemento.style.display = 'none'
}

const mostrarElemento = (elemento, display='block') => {
    elemento.style.display = display
}

const ocultarBotaoEsecao = () => {
    ocultarElemento(botaoVoltar)
    ocultarElemento(sectionDetalhesProduto)
}

ocultarBotaoEsecao()

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
        ocultarElemento(sectionProdutos)
        mostrarElemento(botaoVoltar)
        mostrarElemento(sectionDetalhesProduto, 'grid')

        const cardClicado = e.currentTarget
        const idProduto = cardClicado.id
        const produtoClicado = products.find( product => product.id == idProduto )
        preencherDadosProduto(produtoClicado)
        })
}

const btnCarrinho = document.querySelector('.btn__carrinho .icone')
const sectionCarrinho = document.querySelector('.carrinho')

btnCarrinho.addEventListener('click', () => {
    mostrarElemento(sectionCarrinho)
    ocultarElemento(sectionHero)
    ocultarElemento(sectionProdutos)
    ocultarElemento(sectionDetalhesProduto)
    ocultarElemento(botaoVoltar)
    ocultarElemento(sectionIdentificacao)
    ocultarElemento(sectionPagamento)
})

const btnHome = document.querySelector('.link_home')
btnHome.addEventListener('click', (e) => {
    e.preventDefault()
    ocultarElemento(sectionCarrinho)
    mostrarElemento(sectionHero, 'flex')
    mostrarElemento(sectionProdutos, 'flex')
    ocultarBotaoEsecao()
    resetarSelecao(radios)
    ocultarElemento(sectionIdentificacao)
    ocultarElemento(sectionPagamento)
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
    ocultarElemento(sectionHero)
    mostrarElemento(sectionCarrinho)
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
    spanSubTotal.innerHTML = formatCurrency(total)
    spanTotalCompra.innerHTML = formatCurrency((total + valorFrete) - valorDesconto)

    acaoBotaoApagar()
}

const numeroItens = document.querySelector('.numero_itens')
ocultarElemento(numeroItens)
const atualizarNumeroItens = () => {
    numeroItens.style.display = cart.length ? 'block' : 'none'
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
ocultarElemento(spanId)

let valorFrete = 0
let valorDesconto = 0

const spanSubTotal = document.querySelector('.sub_total')
const spanFrete = document.querySelector('.valor_frete')
const spanDesconto = document.querySelector('.valor_desconto')
const spanTotalCompra = document.querySelector('.total_compra')

spanFrete.innerHTML = formatCurrency(valorFrete)
spanDesconto.innerHTML = formatCurrency(valorDesconto)

const sectionIdentificacao = document.querySelector('.identificacao')
const sectionPagamento = document.querySelector('.pagamento')

ocultarElemento(sectionIdentificacao)
ocultarElemento(sectionPagamento)

const btnContinuarCarrinho = document.querySelector('.btn_continuar')
btnContinuarCarrinho.addEventListener('click', () => {
    ocultarElemento(sectionCarrinho)
    mostrarElemento(sectionIdentificacao)
})

const formularioIdentificacao = document.querySelector('.form_identificacao')
const todosCamposObrigatorios = formularioIdentificacao.querySelectorAll('[required]')
const todosCampos = formularioIdentificacao.querySelectorAll('input')

const pegarDados = () => {
    const dados = {}
    todosCampos.forEach( campo => {
        dados[campo.id] = campo.value.trim()
    })
    return dados
}

    const validacaoDoFormulario = () => {
        todosCamposObrigatorios.forEach( campoObrigatorio => {
            const isEmpty = campoObrigatorio.value.trim() === ''
            const isNotChecked = campoObrigatorio.type === 'checkbox' && !campoObrigatorio.checked

            if(isEmpty) {
                campoObrigatorio.classList.add('campo-invalido')
                campoObrigatorio.nextElementSibling.textContent = `${campoObrigatorio.id} Obrigatorio`
            } else {
                campoObrigatorio.classList.add('campo-valido')
                campoObrigatorio.classList.remove('campo-invalido')
                campoObrigatorio.nextElementSibling.textContent = ''
            }

            if(isNotChecked) {
                campoObrigatorio.parentElement.classList.add('erro')
            } else {
                campoObrigatorio.parentElement.classList.remove('erro')
            }
        } )
    }

const btnFinalizarCadastro = document.querySelector('.btn_finalizar_cadastro')
btnFinalizarCadastro.addEventListener('click', (e) => {

    e.preventDefault()

    validacaoDoFormulario()
    
})

    todosCamposObrigatorios.forEach( campo => {

        const emailRegex = /\S+@\S+\.\S+/

        campo.addEventListener('blur', (e) => {

            if(campo.value !== "" && e.target.type !=="email") {
                campo.classList.add('campo-valido')
                campo.classList.remove('campo-invalido')
                campo.nextElementSibling.textContent = ''
            } else {
                campo.classList.add('campo-invalido')
                campo.classList.remove('campo-valido')
                campo.nextElementSibling.textContent = `${campo.id} é obrigatório`
            }

            if(emailRegex.test(e.target.value)) {
                campo.classList.add('campo-valido')
                campo.classList.remove('campo-invalido')
                campo.nextElementSibling.textContent = ''
            }

            if(e.target.type === "checkbox" && !e.target.checked) {
                campo.parentElement.classList.add('erro')
            } else{
                campo.parentElement.classList.remove('erro')
            }
    })
})

const btnFinalizarCompra = document.querySelector('.btn_finalizar_compra')
btnFinalizarCompra.addEventListener('click', () => {
    ocultarElemento(sectionPagamento)
    mostrarElemento(sectionHero, 'flex')
    mostrarElemento(sectionProdutos, 'flex')
})