import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { T_GameState } from "@/lib/chess/chess.types";
import { ChessUtils } from "@/lib/chess/chess.util";
import type { AlertDialogProps } from "@radix-ui/react-alert-dialog";

export default function GameOverDialog({
  alertDialogProps,
  gameState,
}: {
  alertDialogProps: AlertDialogProps;
  gameState: T_GameState;
}) {
  const content = ChessUtils.getGameOverContent(gameState);
  return (
    <AlertDialog {...alertDialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{content.title}</AlertDialogTitle>
          <AlertDialogDescription>{content.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              alertDialogProps.onOpenChange?.(false);
            }}
          >
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
