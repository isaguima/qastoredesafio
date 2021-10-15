/// <reference types="cypress" />

describe('Adicionar / remover um cupom de desconto no carrinho', () => {
    const cupomFrete = "FRETEGRATIS";
    const cupomValorFixo = "30REAIS";

    beforeEach(() => {
        cy.visit('https://qastoredesafio.lojaintegrada.com.br/carrinho/produto/118475035/adicionar');
    });

    it('Exibir o campo "Cupom de desconto"', () => {
        cy.get('[for=usarCupom]')
            .should("exist")
            .should("contain", "Cupom de desconto:");

        cy.get('#usarCupom')
            .should("exist");

        cy.get('#usarCupom').siblings('button')
            .should("exist")
            .should("contain", "Usar cupom");
    });

    it('Adicionar um cupom que existe', () => {
        cy.get('#usarCupom').type(cupomFrete);
        cy.get('#usarCupom').siblings('button').click();    

        cy.get('#usarCupom')
            .should("not.exist");

        cy.get(".cupom-sucesso b")
            .should("exist")
            .should("contain", "Cupom de desconto:");
    
        cy.get(".cupom-sucesso span")
            .should("exist")
            .should("contain", cupomFrete);
    });

    it('Adicionar um cupom que NÃO existe', () => {
        cy.get('#usarCupom').type("GRATIS");
        cy.get('#usarCupom').siblings('button').click();    
            
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
        cy.get('#usarCupom').type(cupomValorFixo);
        cy.get('#usarCupom').siblings('button').click();
    
        cy.get(".cupom-sucesso b")
            .should("contain", "Cupom de desconto:");
    
        cy.get(".cupom-sucesso span")
            .should("contain", cupomValorFixo);

        cy.get("[title='Remover cupom']")
            .should("exist");

        cy.get(".cupom-valor")
            .should("contain", "R$ 30,00");

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
        cy.get('#usarCupom').type(cupomValorFixo);
        cy.get('#usarCupom').siblings('button').click();    
        cy.get("[title='Remover cupom']").click();

        cy.get(".cupom-sucesso b")
            .should("not.exist");

        cy.get(".cupom-sucesso span")
            .should("not.exist");

        cy.get(".cupom-valor")
            .should("not.exist");
    
        cy.get('[for=usarCupom]')
            .should("exist")
            .should("contain", "Cupom de desconto:");

        cy.get('#usarCupom')
            .should("exist");

        cy.get('#usarCupom').siblings('button')
            .should("exist")
            .should("contain", "Usar cupom");

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
        cy.get('#usarCupom').type(cupomValorFixo);
        cy.get('#usarCupom').siblings('button').click();                
        cy.get("[title='Remover cupom']").click();
        cy.get('#usarCupom').type(cupomFrete);
        cy.get('#usarCupom').siblings('button').click();    
           
        cy.get(".cupom-sucesso span")
            .should("contain", cupomFrete);

        cy.get(".cupom-valor strong")
            .should("contain", "Frete Grátis");

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