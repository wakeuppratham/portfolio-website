"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, RefreshCw, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface LichessPuzzle {
  game: { pgn: string };
  puzzle: {
    id: string;
    rating: number;
    solution: string[];
    themes: string[];
    initialPly: number;
  };
}

type Status = "solving" | "solved" | "wrong";

export default function ChessPuzzle() {
  const { data, isLoading } = useQuery<LichessPuzzle>({
    queryKey: ["chess-puzzle"],
    queryFn: () => fetch("/api/chess/puzzle").then((r) => r.json()),
    staleTime: 60 * 60 * 1000,
  });

  const chessRef = useRef(new Chess());
  const [fen, setFen] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [moveIdx, setMoveIdx] = useState(0);
  const [status, setStatus] = useState<Status>("solving");
  const [hint, setHint] = useState("");
  const [attempts, setAttempts] = useState(0);

  const initPuzzle = useCallback((d: LichessPuzzle) => {
    const chess = chessRef.current;
    chess.reset();

    const temp = new Chess();
    temp.loadPgn(d.game.pgn);
    const history = temp.history({ verbose: true });

    for (let i = 0; i < d.puzzle.initialPly; i++) {
      if (history[i]) chess.move(history[i]);
    }

    const color = chess.turn() === "w" ? "white" : "black";
    setPlayerColor(color);
    setFen(chess.fen());
    setMoveIdx(0);
    setStatus("solving");
    setHint(`${color === "white" ? "White" : "Black"} to move — find the best move.`);
    setAttempts(0);
  }, []);

  useEffect(() => {
    if (data) initPuzzle(data);
  }, [data, initPuzzle]);

  const onPieceDrop = useCallback(
    (source: string, target: string): boolean => {
      if (status !== "solving" || !data) return false;

      const chess = chessRef.current;
      const solution = data.puzzle.solution;
      const expected = solution[moveIdx];

      let move;
      try {
        move = chess.move({
          from: source,
          to: target,
          promotion: expected?.[4] ?? "q",
        });
      } catch {
        return false;
      }
      if (!move) return false;

      const played = source + target;
      const correct = played === expected?.slice(0, 4);

      if (!correct) {
        chess.undo();
        setAttempts((n) => n + 1);
        setStatus("wrong");
        setHint("Not quite. Try again.");
        setTimeout(() => setStatus("solving"), 1200);
        return false;
      }

      setFen(chess.fen());
      const next = moveIdx + 1;

      if (next >= solution.length) {
        setStatus("solved");
        setHint("Puzzle solved!");
        return true;
      }

      // Auto-play opponent response
      const opp = solution[next];
      setMoveIdx(next + 1);
      setHint("Correct! Keep going.");

      setTimeout(() => {
        try {
          chess.move({
            from: opp.slice(0, 2),
            to: opp.slice(2, 4),
            promotion: opp[4] ?? "q",
          });
          setFen(chess.fen());
          if (next + 1 >= solution.length) {
            setStatus("solved");
            setHint("Puzzle solved!");
          }
        } catch { /* ignore */ }
      }, 450);

      return true;
    },
    [data, moveIdx, status]
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground py-8">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        fetching today&apos;s puzzle from lichess...
      </div>
    );
  }

  if (!data || "error" in data) {
    return (
      <p className="font-mono text-xs text-muted-foreground py-8">
        Failed to load puzzle. Try again later.
      </p>
    );
  }

  const themes = data.puzzle.themes
    .filter((t) => !["long", "short", "veryLong"].includes(t))
    .slice(0, 4);
  const totalMoves = Math.ceil(data.puzzle.solution.length / 2);
  const movesFound = Math.floor(moveIdx / 2);

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Board */}
      <div className="max-w-sm w-full mx-auto md:mx-0">
        {fen ? (
          <Chessboard
            options={{
              position: fen,
              boardOrientation: playerColor,
              animationDurationInMs: 200,
              allowDragging: status === "solving",
              boardStyle: {
                borderRadius: "6px",
                boxShadow: "0 0 0 1px hsl(220 15% 22%)",
              },
              darkSquareStyle: { backgroundColor: "#769656" },
              lightSquareStyle: { backgroundColor: "#eeeed2" },
              onPieceDrop: ({ sourceSquare, targetSquare }) =>
                onPieceDrop(sourceSquare, targetSquare ?? ""),
            }}
          />
        ) : (
          <div className="aspect-square w-full rounded-md bg-secondary/20 border border-border/30 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-5 pt-1">
        <div>
          <p className="font-mono text-xs text-primary mb-3 tracking-wider">DAILY PUZZLE</p>
          <div className="flex flex-wrap gap-2">
            <span className="font-mono text-xs text-muted-foreground border border-border/50 rounded px-2 py-0.5">
              Rating {data.puzzle.rating}
            </span>
            {themes.map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] text-muted-foreground/60 border border-border/30 rounded px-1.5 py-0.5 capitalize"
              >
                {t.replace(/([A-Z])/g, " $1").trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Status message */}
        <div className="flex items-center gap-2 min-h-[24px]">
          {status === "solved" && (
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "hsl(142 70% 55%)" }} />
          )}
          {status === "wrong" && (
            <XCircle className="w-4 h-4 shrink-0" style={{ color: "hsl(0 72% 65%)" }} />
          )}
          <p
            className="font-mono text-sm"
            style={{
              color:
                status === "solved"
                  ? "hsl(142 70% 55%)"
                  : status === "wrong"
                  ? "hsl(0 72% 65%)"
                  : "inherit",
            }}
          >
            {hint}
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-1 font-mono text-xs text-muted-foreground">
          <p>
            You play as{" "}
            <span className="text-foreground capitalize">{playerColor}</span>
          </p>
          <p>
            Moves: {movesFound}/{totalMoves}
          </p>
          {attempts > 0 && (
            <p>{attempts} incorrect attempt{attempts !== 1 ? "s" : ""}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => initPuzzle(data)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border/50 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Restart
          </button>
          <a
            href={`https://lichess.org/training/${data.puzzle.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border/50 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View on Lichess
          </a>
        </div>

        {status === "solved" && (
          <p className="font-mono text-[10px] text-muted-foreground/50">
            Powered by Lichess open-source puzzle database
          </p>
        )}
      </div>
    </div>
  );
}
