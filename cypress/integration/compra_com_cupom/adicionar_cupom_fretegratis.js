/// <reference types="cypress" />

describe('Adicionar / remover um cupom de desconto no carrinho', () => {
    const cupomFrete = "FRETEGRATIS";

    beforeEach(() => {
        cy.visit('https://qastoredesafio.lojaintegrada.com.br/carrinho/produto/118475035/adicionar');
        cy.adicionaFrete("03017900");
        cy.get('[data-code="sedex"]').check();
        cy.adicionaCupom(cupomFrete);
    });

    it('Adicionar o cupom Frete grátis', () => {    
        cy.validaTagCupom(cupomFrete, "Frete Grátis");

        cy.get('[data-code="sedex"]')
            .should("be.checked");

        cy.get('[data-code="sedex"]').siblings('.cor-principal')
            .should("contain", "R$ 0,00");

        cy.get('[data-code="sedex"]').siblings('.nome')
            .should("contain", "Frete Grátis");        

        let valorSubtotal;
        let valorTotal;
        
        cy.get(".subtotal strong").should("have.attr", "data-subtotal-valor");
        cy.get(".subtotal strong").invoke("attr", "data-subtotal-valor").then(value => {valorSubtotal = Number(value)});

        cy.get(".total strong").should("have.attr", "data-total-valor");
        cy.get(".total strong").invoke("attr", "data-total-valor").then(value => { 
            valorTotal = Number(value.replace(",",".")); 
            expect(valorTotal).to.be.equal(valorSubtotal);
        });    
    });

    it('Manter o cupom Frete grátis após alterar o CEP', () => {
        cy.adicionaFrete("05767001");
    
        cy.validaTagCupom(cupomFrete, "Frete Grátis");

        cy.get('[data-code="sedex"]')
            .should("be.checked");

        cy.get('[data-code="sedex"]').siblings('.cor-principal')
            .should("contain", "R$ 0,00");

        cy.get('[data-code="sedex"]').siblings('.nome')
            .should("contain", "Frete Grátis");        

        let valorSubtotal;
        let valorTotal;
        
        cy.get(".subtotal strong").should("have.attr", "data-subtotal-valor");
        cy.get(".subtotal strong").invoke("attr", "data-subtotal-valor").then(value => {valorSubtotal = Number(value)});

        cy.get(".total strong").should("have.attr", "data-total-valor");
        cy.get(".total strong").invoke("attr", "data-total-valor").then(value => { 
            valorTotal = Number(value.replace(",",".")); 
            expect(valorTotal).to.be.equal(valorSubtotal);
        });    
    });

    it('Manter o cupom Frete grátis no Checkout', () => {
        cy.irParaCheckout();

        cy.url()
            .should('contain', '/checkout/');

        cy.get(".cupom-codigo")
            .should("contain", cupomFrete);

        cy.get(".desconto span strong")
            .should("contain", "Frete grátis");

        cy.get(".frete-preco strong")
            .should("contain", "R$ 0,00");   
            
        let valorSubtotal;
        let valorTotal;
            
        cy.get(".subtotal").should("have.attr", "data-subtotal");
        cy.get(".subtotal").invoke("attr", "data-subtotal").then(value => { 
            valorSubtotal = Number(value.replace(",","."))
        });
    
        cy.get(".total").should("have.attr", "data-total");
        cy.get(".total").invoke("attr", "data-total").then(value => { 
            valorTotal = Number(value.replace(",",".")); 
            expect(valorTotal).to.be.equal(valorSubtotal);
        });  

        cy.get('[data-codigo="sedex"]')
            .should("be.checked");

        cy.get('.envio-preco')
            .should("contain", "R$ 0,00");

        cy.get('.envio-nome')
            .should("contain", "Frete Grátis");     
    });

    it('O cupom Frete grátis deve ser aplicado na forma de pagamento', () => {
        cy.irParaCheckout();

        cy.url()
            .should('contain', '/checkout/');

        cy.get('#radio-cartao').check();
        cy.get('#cartao_cartao_numero')
            .should("exist")
            .type("5466 2003 2545 1716")
            .blur();
      
        cy.get(".total").invoke("attr", "data-total").as("valorTotal");
        cy.get("[data-valor-parcela]").invoke("attr", "data-valor-parcela").as("valorParcela");
        cy.get(".li-box-payment-cc .pagamento-valor").invoke("text").as("valorCartao");
        cy.get(".li-box-payment-mercadopagov1-18 .pagamento-valor").invoke("text").as("valorMercado");
        cy.get(".li-box-payment-mercadopagov1-520160 .pagamento-valor").invoke("text").as("valorBoleto");

        cy.get("@valorTotal").then(valorTotal => {
            const valorTotalLimpo = Number(valorTotal.replace(",","."));
           
            cy.get("@valorParcela").then(valorParcela => {
                const valorParcelaLimpo = Number(valorParcela.replace(",","."));
                expect(valorParcelaLimpo).to.be.equal(valorTotalLimpo);
            })
        });

        cy.get("@valorTotal").then(valorTotal => {
            const valorTotalLimpo = Number(valorTotal.replace(",","."));
           
            cy.get("@valorCartao").then(valorCartao => {
                const valorCartaoLimpo = Number(valorCartao.replace("R$","").replace(",",".").trim());
                expect(valorCartaoLimpo).to.be.equal(valorTotalLimpo);
            })
        });

        cy.get("@valorTotal").then(valorTotal => {
            const valorTotalLimpo = Number(valorTotal.replace(",","."));
           
            cy.get("@valorMercado").then(valorMercado => {
                const valorMercadoLimpo = Number(valorMercado.replace("R$","").replace(",",".").trim());
                expect(valorMercadoLimpo).to.be.equal(valorTotalLimpo);
            })
        });

        cy.get("@valorTotal").then(valorTotal => {
            const valorTotalLimpo = Number(valorTotal.replace(",","."));
           
            cy.get("@valorBoleto").then(valorBoleto => {
                const valorBoletoLimpo = Number(valorBoleto.replace("R$","").replace(",",".").trim());
                expect(valorBoletoLimpo).to.be.equal(valorTotalLimpo);
            })
        });

    });

    it('Fechar uma compra com cupom Frete grátis', () => {
        cy.irParaCheckout();

        cy.url()
            .should('contain', '/checkout/');

        cy.get('#radio-mercadopagov1-520160').check();
        cy.get('#finalizarCompra').click();

        cy.url()
            .should('contain', '/finalizacao');

        cy.get('#imprimirBoleto')
            .should("exist");

    });
})