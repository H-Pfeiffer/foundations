const ticketValidation = require('../util/ticketValidation.js');

describe("ticketValidation Test Version 1", () => {

    describe("isValidAmount Test Version 1", () => {
        test("non-negative or zero whole number amounts should be valid", () => {
            const result = ticketValidation.isValidAmount(12);
            expect(result).toBe(true);
        })

        test("non-negative or zero decimal amounts should be valid", () => {
            const result = ticketValidation.isValidAmount(12.34);
            expect(result).toBe(true);
        })

        test("zero amounts should be invalid", () => {
            const result = ticketValidation.isValidAmount(0);
            expect(result).toBe(false);
        })

        test("negative amounts should be invalid", () => {
            const result = ticketValidation.isValidAmount(-12);
            expect(result).toBe(false);
        })

        test("No input should be invalid", () => {
            const result = ticketValidation.isValidAmount();
            expect(result).toBe(false);
        })
    })

    describe("isValidDescription Test Version 1", () => {
        test("An input description should be valid", () => {   
            const result = ticketValidation.isValidDescription("travel expenses");
            expect(result).toBe(true)     
        })
        test("No input should be invalid", () => {   
            const result = ticketValidation.isValidDescription();
            expect(result).toBe(false)             
        })
    })
    
    describe("createFormattedTicket Test Version 1", () => {
        let user_idExample;
        let descriptionExample;
        let amountExample;

        beforeAll(() => {
            user_id = "123456";
            description = "hotel";
            amount = 210.65;
        })

        test("does not change valid user input when returning", () => { 
            const { user_id, description, amount } = ticketValidation.createFormattedTicket(user_idExample, descriptionExample, amountExample);

            expect(user_id).toEqual(user_idExample);
            expect(description).toEqual(descriptionExample);
            expect(amount).toEqual(amountExample);
        })
    })
})