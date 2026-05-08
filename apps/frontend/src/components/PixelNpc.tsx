export function PixelNpc({ speaking = true }: { speaking?: boolean }) {
  return (
    <div className="npc-wrap" aria-label="두리번 도트 NPC">
      <div className={`npc ${speaking ? 'npc-bounce' : ''}`}>
        <div className="npc-hat" />
        <div className="npc-face">
          <span className="eye left" />
          <span className="eye right" />
          <span className="mouth" />
        </div>
        <div className="npc-body" />
        <div className="npc-feet" />
      </div>
      <div className="npc-shadow" />
    </div>
  );
}
