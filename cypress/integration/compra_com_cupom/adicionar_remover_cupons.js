/// <reference types="cypress" />

describe('Adicionar / remover um cupom de desconto no carrinho', () => {
    const cupomFrete = "FRETEGRATIS";
    const cupomValorFixo = "30REAIS";

    beforeEach(() => {
        cy.visit('https://qastoredesafio.lojaintegrada.com.br/carrinho/produto/118475035/adicionar');
    });

    it('Exibir o campo "Cupom de desconto"', () => {
        cy.validaCampoCupom();
    });

    it('Adicionar um cupom que existe', () => {
        cy.adicionaCupom(cupomFrete);

        cy.validaTagCupom(cupomFrete, "Frete Grátis");
    });

    it('Adicionar um cupom que NÃO existe', () => {
        cy.adicionaCupom("GRATIS");
            
        cy.get(".cupom-sucesso b")
            .should("not.exist");

        cy.get(".cupom-sucesso span")
            .should("not.exist");

        cy.get(".alert")
            .should("exist")
            .should("contain", "Cupom não encontrado.");

        cy.get('#usarCupom')
            .should("exist")
            .should("have.value", "");
    });

    it('Adicionar cupom no carrinho', () => {
        cy.adicionaCupom(cupomValorFixo);
    
        cy.validaTagCupom(cupomValorFixo, "R$ 30,00");

        let valorSubtotal;
        let valorTotal;
        
        cy.get(".subtotal strong").should("have.attr", "data-subtotal-valor");
        cy.get(".subtotal strong").invoke("attr", "data-subtotal-valor").then(value => { 
            valorSubtotal = Number(value.replace(",","."))
        });

        cy.get(".total strong").should("have.attr", "data-total-valor");
        cy.get(".total strong").invoke("attr", "data-total-valor").then(value => { 
            valorTotal = Number(value.replace(",",".")); 
            console.log(value);
            expect(valorTotal).to.be.equal(valorSubtotal - 30);
        });     
    });

    it('Remover o cupom do carrinho', () => {
        cy.adicionaCupom(cupomValorFixo);
        cy.get("[title='Remover cupom']").click();

        cy.get(".cupom-sucesso b")
            .should("not.exist");

        cy.get(".cupom-sucesso span")
            .should("not.exist");

        cy.get(".cupom-valor")
            .should("not.exist");
    
        cy.validaCampoCupom();

        let valorSubtotal;
        let valorTotal;
    
        cy.get(".subtotal strong").should("have.attr", "data-subtotal-valor");
        cy.get(".subtotal strong").invoke("attr", "data-subtotal-valor").then(value => { 
            valorSubtotal = Number(value.replace(",","."))
        });

        cy.get(".total strong").should("have.attr", "data-total-valor");
        cy.get(".total strong").invoke("attr", "data-total-valor").then(value => {
            valorTotal = Number(value.replace(",",".")); 
            expect(valorTotal).to.be.equal(valorSubtotal);
        });    
    });

    it('Remover o cupom do carrinho e adicionar outro cupom', () => {
        cy.adicionaCupom(cupomValorFixo);            
        cy.get("[title='Remover cupom']").click();
        cy.adicionaCupom(cupomFrete);    
           
        cy.validaTagCupom(cupomFrete, "Frete Grátis");

        let valorSubtotal;
        let valorTotal;
        
        cy.get(".subtotal strong").should("have.attr", "data-subtotal-valor");
        cy.get(".subtotal strong").invoke("attr", "data-subtotal-valor").then(value => { 
            valorSubtotal = Number(value.replace(",","."))
        });

        cy.get(".total strong").should("have.attr", "data-total-valor");
        cy.get(".total strong").invoke("attr", "data-total-valor").then(value => { 
            valorTotal = Number(value.replace(",",".")); 
            expect(valorTotal).to.be.equal(valorSubtotal);
        });   
    });
})