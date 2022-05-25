use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[account]
#[derive(Default)]
pub struct Counter {
    value: u32,
}

#[program]
pub mod mutable_references {
    use super::*;

    pub fn increment_two_counters(ctx: Context<IncrementTwoCounters>) -> Result<()> {
        ctx.accounts.counter1.value += 1;
        ctx.accounts.counter2.value += 1;

        Ok(())
    }

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    user: Signer<'info>,
    #[account(
        init, 
        space = 100,
        seeds = ["counter1".as_ref()],
        bump,
        payer = user
    )]
    counter1: Account<'info, Counter>,
    #[account(
        init, 
        space = 100,
        seeds = ["counter2".as_ref()],
        bump,
        payer = user
    )]
    counter2: Account<'info, Counter>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IncrementTwoCounters<'info> {
    #[account(mut)]
    counter1: Account<'info, Counter>,
    #[account(mut)]
    counter2: Account<'info, Counter>,
}
