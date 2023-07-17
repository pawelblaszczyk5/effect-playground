import { Context, Effect, Logger, LoggerLevel } from "effect";

import * as UserServiceLive from "~/user";

//  Effect program

const program = Effect.sync(() => "Hello, world!");

Effect.runSync(program.pipe(Effect.tap(Effect.log)));

// Pipes

const now = Effect.sync(() => Date.now());

const elapsed = <R, E, A>(self: Effect.Effect<R, E, A>): Effect.Effect<R, E, A> =>
	Effect.Do.pipe(
		Effect.bind("startMilliseconds", () => now),
		Effect.bind("result", () => self),
		Effect.bind("endMilliseconds", () => now),
		Effect.tap(({ endMilliseconds, startMilliseconds }) =>
			Effect.log(`Elapsed: ${endMilliseconds - startMilliseconds}`),
		),
		Effect.map(({ result }) => result),
	);

const addSuffix = (input: string) => Effect.succeed(`${input}-example-suffix`);

const examplePipe = (self: Effect.Effect<never, never, string>) =>
	self.pipe(
		Effect.flatMap(value => addSuffix(value)),
		Effect.tap(Effect.log),
		Effect.tap(() => Effect.sleep("5 seconds")),
		Effect.flatMap(value =>
			Effect.if(value === "test-example-suffix", {
				onFalse: Effect.succeed("invalid"),
				onTrue: Effect.succeed("correct"),
			}),
		),
		Effect.tap(value => Effect.log(value, { level: "Trace" })),
		Logger.withMinimumLogLevel(LoggerLevel.fromLiteral("All")),
		elapsed,
	);

void Effect.runPromise(Effect.succeed("test").pipe(examplePipe));
void Effect.runPromise(Effect.succeed("test2").pipe(examplePipe));

const UserService = Context.Tag<typeof import("~/user")>();

const programWithService = UserService.pipe(
	Effect.flatMap(UserService => Effect.succeed(UserService.getUser())),
	Effect.tap(user => Effect.log(JSON.stringify(user))),
);

const runnableProgramWithService = Effect.provideService(programWithService, UserService, UserServiceLive);

Effect.runSync(runnableProgramWithService);
