import { Context, Effect } from "effect";

type Random = {
	readonly next: () => Effect.Effect<never, never, number>;
};

const Random = Context.Tag<Random>();

Random.pipe(Effect.flatMap(t => t.next()));
