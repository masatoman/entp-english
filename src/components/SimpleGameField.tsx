import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, Enemy, Tower, Position, DropItem } from '../types/simple-game';
import { GAME_CONFIG } from '../utils/simple-game-logic';

interface SimpleGameFieldProps {
  gameState: GameState;
  onFieldClick: (position: Position) => void;
  onDropItemClick?: (itemId: string) => void;
}

export function SimpleGameField({ gameState, onFieldClick, onDropItemClick }: SimpleGameFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 敵タイプ別の色定義
  const getEnemyColor = (type: string): string => {
    switch (type) {
      case 'basic': return '#ff4444';
      case 'fast': return '#44ff44';
      case 'tank': return '#4444ff';
      case 'regen': return '#ff44ff';
      case 'shield': return '#44ffff';
      case 'stealth': return '#888888';
      case 'boss': return '#ff8800';
      default: return '#ff4444';
    }
  };

  // 敵を描画
  const drawEnemy = useCallback((ctx: CanvasRenderingContext2D, enemy: Enemy) => {
    if (!enemy.isAlive) return;

    // ステルス敵で非表示の場合
    if (!enemy.isVisible) {
      ctx.globalAlpha = 0.3;
    } else {
      ctx.globalAlpha = 1.0;
    }

    const { x, y } = enemy.position;
    const size = enemy.type === 'boss' ? 30 : (enemy.type === 'tank' ? 25 : 20);

    // 敵の本体（タイプ別の色）
    ctx.fillStyle = getEnemyColor(enemy.type);
    ctx.beginPath();
    
    // ボス敵は四角、その他は円
    if (enemy.type === 'boss') {
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    } else {
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // アーマー表示（タンク敵用）
    if (enemy.armor > 0) {
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, size / 2 + 2, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // シールドバー（シールド敵用）
    if (enemy.maxShield > 0) {
      const shieldBarWidth = 35;
      const shieldBarHeight = 3;
      const shieldPercentage = enemy.shield / enemy.maxShield;

      // シールドバー背景
      ctx.fillStyle = '#002244';
      ctx.fillRect(x - shieldBarWidth / 2, y - size / 2 - 15, shieldBarWidth, shieldBarHeight);

      // シールドバー
      ctx.fillStyle = '#44aaff';
      ctx.fillRect(x - shieldBarWidth / 2, y - size / 2 - 15, shieldBarWidth * shieldPercentage, shieldBarHeight);
    }

    // 体力バー
    const barWidth = 30;
    const barHeight = 4;
    const healthPercentage = enemy.currentHealth / enemy.maxHealth;
    const barY = enemy.maxShield > 0 ? y - size / 2 - 11 : y - size / 2 - 10;

    // 体力バー背景
    ctx.fillStyle = '#666';
    ctx.fillRect(x - barWidth / 2, barY, barWidth, barHeight);

    // 体力バー（緑→黄→赤）
    if (healthPercentage > 0.6) ctx.fillStyle = '#4CAF50';
    else if (healthPercentage > 0.3) ctx.fillStyle = '#FFC107';
    else ctx.fillStyle = '#F44336';
    
    ctx.fillRect(x - barWidth / 2, barY, barWidth * healthPercentage, barHeight);

    // 再生エフェクト（再生敵用）
    if (enemy.regenRate > 0 && enemy.isAlive) {
      ctx.strokeStyle = '#88ff88';
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.arc(x, y, size / 2 + 4, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 敵の名前（ステルス時以外）
    if (enemy.isVisible) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(enemy.type.toUpperCase(), x, y + size / 2 + 2);
    }

    ctx.globalAlpha = 1.0; // 透明度をリセット
  }, []);

  // ドロップアイテムを描画
  const drawDropItem = useCallback((ctx: CanvasRenderingContext2D, item: DropItem) => {
    if (item.isCollected) return;

    const { x, y } = item.position;
    
    // レアリティ別の色
    const rarityColors = {
      common: '#aaaaaa',
      rare: '#4dabf7',
      epic: '#9775fa',
      legendary: '#ffd43b'
    };
    
    // アイテムタイプ別のアイコン
    const itemIcons = {
      'damage-boost': '⚔️',
      'range-boost': '🎯',
      'speed-boost': '⚡',
      'gold-bonus': '💰',
      'xp-bonus': '⭐'
    };
    
    // 時間による点滅効果
    const age = Date.now() - item.spawnTime;
    const timeRemaining = item.lifetime - age;
    const blinkThreshold = item.lifetime * 0.3; // 残り30%で点滅開始
    
    let alpha = 1;
    if (timeRemaining < blinkThreshold) {
      alpha = 0.5 + 0.5 * Math.sin((Date.now() / 200) % (2 * Math.PI));
    }
    
    ctx.globalAlpha = alpha;
    
    // 外側の大きなクリック領域（透明）
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    // 背景の光る円（より大きく）
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
    gradient.addColorStop(0, rarityColors[item.rarity] + '80');
    gradient.addColorStop(1, rarityColors[item.rarity] + '20');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // アイテム本体（より大きく）
    ctx.fillStyle = rarityColors[item.rarity];
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    // 境界線（より太く）
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // クリック可能を示す外側の円
    ctx.strokeStyle = rarityColors[item.rarity];
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // アイコン（より大きく）
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(itemIcons[item.type] || '?', x, y);
    
    // 効果値表示（より大きく）
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const valueText = item.isPercentage ? `+${item.value}%` : `+${item.value}`;
    ctx.fillText(valueText, x, y + 15);
    
    // "CLICK" テキスト
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('CLICK', x, y - 15);
    
    ctx.globalAlpha = 1.0;
  }, []);

  // タワータイプ別の色とアイコン
  const getTowerColor = (type: string): string => {
    switch (type) {
      case 'basic': return '#4CAF50';
      case 'sniper': return '#2196F3';
      case 'rapid': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  const getTowerIcon = (type: string): string => {
    switch (type) {
      case 'basic': return '⚔️';
      case 'sniper': return '🎯';
      case 'rapid': return '⚡';
      default: return '⚔️';
    }
  };

  // タワーを描画
  const drawTower = useCallback((ctx: CanvasRenderingContext2D, tower: Tower) => {
    const { x, y } = tower.position;
    const size = 25;

    // 射程範囲（薄い色の円）
    const towerColor = getTowerColor(tower.type);
    ctx.fillStyle = towerColor + '20';
    ctx.strokeStyle = towerColor + '60';
    ctx.beginPath();
    ctx.arc(x, y, tower.range, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // タワー本体（タイプ別の色）
    ctx.fillStyle = towerColor;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
    ctx.fill();

    // 境界線
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // タワーアイコン
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(getTowerIcon(tower.type), x, y);

    // タワー名（小さく）
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(tower.name, x, y + size / 2 + 2);
  }, []);

  // 敵の進路を描画
  const drawPath = useCallback((ctx: CanvasRenderingContext2D) => {
    const path = GAME_CONFIG.enemyPath;
    if (path.length < 2) return;

    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 6;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    ctx.lineTo(path[1].x, path[1].y);
    ctx.stroke();
    ctx.setLineDash([]); // リセット
  }, []);

  // キャンバス描画
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 背景をクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景色（濃いグレー）
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 境界線
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // 敵の進路を描画
    drawPath(ctx);

    // タワーを描画
    gameState.towers.forEach(tower => drawTower(ctx, tower));

    // 敵を描画
    gameState.enemies.forEach(enemy => drawEnemy(ctx, enemy));
    
    // ドロップアイテムを描画
    gameState.dropItems.forEach(item => drawDropItem(ctx, item));

    // グリッド（オプション）
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    const gridSize = 50;
    
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [gameState, drawEnemy, drawTower, drawPath]);

  // マウスクリック処理
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // ドロップアイテムのクリック検出（範囲を大きく）
    const clickedItem = gameState.dropItems.find(item => {
      if (item.isCollected) return false;
      const distance = Math.sqrt(
        Math.pow(x - item.position.x, 2) + Math.pow(y - item.position.y, 2)
      );
      return distance <= 25; // クリック範囲25ピクセル（15→25に拡大）
    });

    if (clickedItem && onDropItemClick) {
      onDropItemClick(clickedItem.id);
      return; // アイテムをクリックした場合は通常のフィールドクリックは発生させない
    }

    onFieldClick({ x, y, row: Math.floor(y / 40), col: Math.floor(x / 40) });
  }, [onFieldClick, onDropItemClick, gameState.dropItems]);

  // 描画の更新
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.fieldWidth}
        height={GAME_CONFIG.fieldHeight}
        className="border-2 border-gray-400 rounded-lg cursor-crosshair shadow-lg"
        onClick={handleCanvasClick}
        style={{
          maxWidth: '100%',
          height: 'auto',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* 操作説明 */}
      <div className="mt-2 text-sm text-gray-600 space-y-1">
        <div className="grid grid-cols-2 gap-2 sm:block">
          <p>• 青い点線: 敵の移動ルート</p>
          <p>• 青い円: タワーの射程範囲</p>
          <p>• クリック: タワー設置（コストは段階的に増加）</p>
          <p>• 赤い円: 敵（体力バー付き）</p>
          <p>• 光る円: ドロップアイテム（クリックで取得）</p>
        </div>
      </div>
    </div>
  );
}
