import * as Effect from "@effect/io/Effect";
import * as Logger from "@effect/io/Logger";
import * as LoggerLevel from "@effect/io/Logger/Level";

//  Effect program

const program = Effect.sync(() => "Hello, world!");

const result = Effect.runSync(program);

console.log(result);

// Pipes

const addSuffix = (input: string) => Effect.succeed(`${input}-example-suffix`);

const examplePipe = Effect.succeed("test" as const).pipe(
	Effect.flatMap(value => addSuffix(value)),
	Effect.tap(Effect.log),
	Effect.tap(() => Effect.sleep("5 seconds")),
	Effect.flatMap(value =>
		Effect.if(value === "text-example-suffix", {
			onFalse: Effect.succeed("correct"),
			onTrue: Effect.succeed("invalid"),
		}),
	),
	Effect.flatMap(value => addSuffix(value)),
	Effect.tap(value => Effect.log(value, { level: "Trace" })),
	Logger.withMinimumLogLevel(LoggerLevel.fromLiteral("All")),
);

const pipeResult = await Effect.runPromise(examplePipe);

console.log(pipeResult);
