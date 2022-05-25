import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { MutableReferences } from "../target/types/mutable_references";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";

describe("mutable-references", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .MutableReferences as Program<MutableReferences>;

  it("Is initialized!", async () => {
    const [counter1] = await PublicKey.findProgramAddress(
      [utf8.encode("counter1")],
      program.programId
    );

    const [counter2] = await PublicKey.findProgramAddress(
      [utf8.encode("counter2")],
      program.programId
    );

    const tx = await program.methods
      .initialize()
      .accounts({
        counter1,
        counter2,
      })
      .rpc();

    // console.log(JSON.stringify(program.account.counter.fetch(counter1)));

    let counterData1 = await program.account.counter.fetch(counter1);
    let counterData2 = await program.account.counter.fetch(counter2);

    let value1 = counterData1.value.toString();
    let value2 = counterData2.value.toString();

    console.log("value1: " + value1 + "\nvalue2: " + value2);

    console.log("gonna increment two counters");

    await program.methods
      .incrementTwoCounters()
      .accounts({
        counter1,
        counter2: counter1,
      })
      .rpc();

    counterData1 = await program.account.counter.fetch(counter1);
    counterData2 = await program.account.counter.fetch(counter2);

    value1 = counterData1.value.toString();
    value2 = counterData2.value.toString();

    console.log("value1: " + value1 + "\nvalue2: " + value2);
  });
});
