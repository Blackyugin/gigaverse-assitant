import React, { useState, useRef } from "react";
import { Button, TextField, Card, CardContent, Select, MenuItem, InputLabel, FormControl, Grid, Typography, Box, Paper, Container } from "@mui/material";
import { CheckCircle, SportsScore, Shield, FitnessCenter } from "@mui/icons-material";


// Définitions des statistiques par défaut pour les mouvements du joueur et de l'ennemi
const defaultMoveStats = {
  sword: { damage: 4, armor: 0, uses: 3 },
  shield: { damage: 0, armor: 4, uses: 3 },
  spell: { damage: 3, armor: 2, uses: 3 },
};

const defaultEnemyMoveStats = {
  sword: { damage: 4, armor: 0, uses: 3 },
  shield: { damage: 0, armor: 4, uses: 3 },
  spell: { damage: 2, armor: 2, uses: 3 },
};

// Définir les types de mouvements disponibles
const MOVES = ["sword", "shield", "spell"];

const getWinner = (player, enemy) => {
  if (player === enemy) return "draw";
  if ((player === "sword" && enemy === "spell") ||
      (player === "shield" && enemy === "sword") ||
      (player === "spell" && enemy === "shield")) {
    return "player";
  }
  return "enemy";
};

const enemiesList = {
  redRobe: {
    name: "Red Robe", 
    hp: 4,
    maxHp: 4,
    armor: 2,
    maxArmor: 2,
    moves: defaultEnemyMoveStats
  },
  blackRobe: {
    name: "Black Robe", 
    hp: 2,
    maxHp: 2,
    armor: 5,
    maxArmor: 5,
    moves: {
      sword: { damage: 4, armor: 2, uses: 3 },
      shield: { damage: 2, armor: 4, uses: 3 },
      spell: { damage: 2, armor: 3, uses: 3 }
    }
  },
  blackKnight: {
    name: "Black Knight", 
    hp: 6,
    maxHp: 6,
    armor: 4,
    maxArmor: 4,
    moves: {
      sword: { damage: 4, armor: 2, uses: 3 },
      shield: { damage: 2, armor: 4, uses: 3 },
      spell: { damage: 5, armor: 2, uses: 3 }
    }
  },
  darkGuard: {
    name: "Dark Guard", 
    hp: 9,
    maxHp: 9,
    armor: 6,
    maxArmor: 6,
    moves: {
      sword: { damage: 4, armor: 2, uses: 3 },
      shield: { damage: 7, armor: 2, uses: 3 },
      spell: { damage: 2, armor: 4, uses: 3 }
    }
  },
  paladin: {
    name: "Paladin", 
    hp: 12,
    maxHp: 12,
    armor: 8,
    maxArmor: 8,
    moves: {
      sword: { damage: 2, armor: 3, uses: 3 },
      shield: { damage: 7, armor: 5, uses: 3 },
      spell: { damage: 3, armor: 4, uses: 3 }
    }
  }
}

const calculateEffect = (attacker, defender, move, result, opponentMove = null) => {
  const applyDamage = (attacker, defender, move) => {
    const { damage, armor } = attacker.moves[move];

    // Gagne de l’armure
    attacker.armor = Math.min(attacker.maxArmor, attacker.armor + armor);

    // Appliquer les dégâts en tenant compte de l’armure
    const absorbed = Math.min(defender.armor, damage);
    defender.armor -= absorbed;
    const remaining = damage - absorbed;
    defender.hp = Math.max(0, defender.hp - remaining);
  };

  if (result === "player" || result === "enemy") {
    applyDamage(attacker, defender, move);
  }

  if (result === "draw" && opponentMove) {
    // Les deux côtés gagnent leur armure
    attacker.armor = Math.min(attacker.maxArmor, attacker.armor + attacker.moves[move].armor);
    defender.armor = Math.min(defender.maxArmor, defender.armor + defender.moves[opponentMove].armor);

    // Attaquant subit les dégâts de l'adversaire
    const incomingFromDefender = defender.moves[opponentMove].damage;
    const absorbedByAttacker = Math.min(attacker.armor, incomingFromDefender);
    attacker.armor -= absorbedByAttacker;
    attacker.hp = Math.max(0, attacker.hp - (incomingFromDefender - absorbedByAttacker));

    // Défenseur subit les dégâts de l'attaquant
    const incomingFromAttacker = attacker.moves[move].damage;
    const absorbedByDefender = Math.min(defender.armor, incomingFromAttacker);
    defender.armor -= absorbedByDefender;
    defender.hp = Math.max(0, defender.hp - (incomingFromAttacker - absorbedByDefender));
  }
};


export default function CombatAssistant() {
  const [player, setPlayer] = useState({
    hp: 14,
    maxHp: 14,
    armor: 2,
    maxArmor: 2,
    moves: defaultMoveStats,
    uses: { sword: 3, shield: 3, spell: 3 },
    cooldowns: { sword: 0, shield: 0, spell: 0 },
  });

  const [enemy, setEnemy] = useState({
    hp: 4,
    maxHp: 4,
    armor: 2,
    maxArmor: 2,
    moves: defaultEnemyMoveStats,
    uses: { sword: 3, shield: 3, spell: 3 },
    cooldowns: { sword: 0, shield: 0, spell: 0 },
  });

  const [playerMove, setPlayerMove] = useState("sword");
  const [enemyMove, setEnemyMove] = useState("sword");
  const [history, setHistory] = useState([]);
  const [showPlayerEdit, setShowPlayerEdit] = useState(true);
  const [showEnemyEdit, setShowEnemyEdit] = useState(false);
  const [showMoveStatsEdit, setShowMoveStatsEdit] = useState(false);

  // Liste ordonnée des ennemis
  const enemyKeys = Object.keys(enemiesList);
  const currentEnemyIndex = useRef(0);

  // Fonction pour charger un ennemi depuis enemiesList
  const loadEnemy = (index) => {
    const enemyKey = enemyKeys[index];
    if (!enemyKey) {
      alert("🎉 Tous les ennemis ont été vaincus !");
      return;
    }

    const base = enemiesList[enemyKey];

    // Recharge un nouvel ennemi (copie pour ne pas muter l'objet original)
    setEnemy({
      ...base,
      hp: base.maxHp,
      maxHp: base.maxHp,
      armor: base.maxArmor,
      maxArmor: base.maxArmor,
      moves: JSON.parse(JSON.stringify(base.moves)),
      uses: { sword: 3, shield: 3, spell: 3 },
      cooldowns: { sword: 0, shield: 0, spell: 0 }
    });
  };

  // Exemple de vérification dans ta boucle de combat ou après l’attaque du joueur
  const checkEnemyDefeat = () => {
      currentEnemyIndex.current += 1;
      console.log("currentEnemyIndex: "+currentEnemyIndex);
      loadEnemy(currentEnemyIndex.current);
  };

  const resetGame = () => {
    setPlayer({
      ...player,
      hp: player.maxHp,
      armor: player.maxArmor,
      uses: { sword: 3, shield: 3, spell: 3 },
      cooldowns: { sword: 0, shield: 0, spell: 0 },
    });
    setEnemy({
      ...enemy,
      hp: 4,
      armor: 2,
      uses: { sword: 3, shield: 3, spell: 3 },
      cooldowns: { sword: 0, shield: 0, spell: 0 },
    });
    setHistory([]);
  };

  const handleBestMove = () => {
    const availableMoves = Object.keys(player.moves).filter(
      (move) => (player.uses[move] ?? 0) > 0
    );

    if (availableMoves.length === 0) {
      alert("Aucun move disponible ! Rechargez vos actions.");
      return;
    }

    const enemyHPPercent = (enemy.hp / enemy.maxHp) * 100;
    const playerHPPercent = (player.hp / player.maxHp) * 100;
    const enemyLowHP = enemyHPPercent <= 25;
    const playerLowHP = playerHPPercent <= 25;
    const enemyArmorMaxed = enemy.armor >= enemy.maxArmor;
    const playerArmorMaxed = player.armor >= player.maxArmor;

    const lastEnemyMove = history[0]?.enemyMove ?? null;
    const predictedEnemyMove = history[0]?.enemyMove ?? "sword"; // default

    const counterMove = getCounterMove(predictedEnemyMove);

    const bestMove = availableMoves.reduce((best, move) => {
      const stats = defaultMoveStats[move];
      let score = 0;

      // 🎯 Si l'ennemi est affaibli, on peut le finir
      if (enemyLowHP && stats.damage > 0) score += 4;

      // 🛡 Si nous sommes affaiblis, on cherche à survivre
      if (playerLowHP && stats.armor > 0) score += 4;

      // 🔁 Éviter d’utiliser un move presque épuisé
      if (player.uses[move] === 1) score -= 1;

      // 🔮 Anticiper un move défensif de l’ennemi
      if (lastEnemyMove && defaultEnemyMoveStats[lastEnemyMove].armor > defaultEnemyMoveStats[lastEnemyMove].damage) {
        if (stats.armor > 0) score += 2;
        if (stats.damage > 0) score += 1;
      }

      // 🧠 Contre le type probable du move ennemi
      if (move === counterMove) score += 3;

      // ⚖️ Si l'ennemi a beaucoup d’armure, on force l'attaque
      if (enemy.armor >= 3 && stats.damage > 0) score += 2;

      // ⚔️ Poids de l’attaque
      score += stats.damage * 1.5;

      // 🧱 Poids de la défense (si on n’est pas au max)
      if (!playerArmorMaxed) score += stats.armor * 1;

      // 🔁 Utilisation restante
      score += player.uses[move] * 0.3;

      return score > best.score ? { move, score } : best;
    }, { move: null, score: -Infinity }).move;

    if (bestMove) {
      alert(`🤖 Meilleur move suggéré : ${bestMove.toUpperCase()}`);
    } else {
      alert("Aucun move optimal trouvé.");
    }
  };

  // Helper pour trouver le move qui bat un autre
  function getCounterMove(move) {
    if (move === "sword") return "spell";
    if (move === "spell") return "shield";
    if (move === "shield") return "sword";
    return null;
  }

  const handleTurn = () => {
    const result = getWinner(playerMove, enemyMove);
    const newPlayer = { ...player };
    const newEnemy = { ...enemy };

    if (newPlayer.uses[playerMove] <= 0) {
      alert(`Vous ne pouvez plus utiliser le move ${playerMove.toUpperCase()} (0 utilisation restante).`);
      return;
    }

    console.log(result);

    if (result === "draw") {
      // Appliquer d'abord l'armure puis les dégâts de part et d'autre
      calculateEffect(newPlayer, newEnemy, playerMove, "draw", enemyMove);
    } else if (result === "player") {
      calculateEffect(newPlayer, newEnemy, playerMove, "player");
    } else {
      calculateEffect(newEnemy, newPlayer, enemyMove, "enemy");
    }

    // Gestion des utilisations et cooldowns
    const updateUsage = (state, usedMove) => {
      for (let move of MOVES) {
        if (move === usedMove) {
          if (state.uses[move] > 0) state.uses[move]--;
          if (state.uses[move] === 0) state.cooldowns[move] = 1;
        } else {
          if (state.cooldowns[move] > 0) {
            state.cooldowns[move]--;
          } else if (state.uses[move] < defaultMoveStats[move].uses) {
            state.uses[move]++;
          }
        }
      }
    };

    updateUsage(newPlayer, playerMove);
    updateUsage(newEnemy, enemyMove);

    setPlayer(newPlayer);
    setEnemy(newEnemy);
    setHistory([{ playerMove, enemyMove, result }, ...history]);

    if (newPlayer.hp <= 0) {
      currentEnemyIndex.current = 0;
      resetGame();
    } else if (newEnemy.hp <= 0) {
      alert("Enemy defeated! Update enemy stats for next round.");

      checkEnemyDefeat();

      setShowEnemyEdit(true);
      setShowPlayerEdit(true);
    }
  };

  const updatePlayerStats = (event) => {
    event.preventDefault();
    const updatedPlayer = { ...player };

    // Mise à jour des stats générales
    updatedPlayer.hp = event.target.hp.value;
    updatedPlayer.maxHp = event.target.maxHp.value;
    updatedPlayer.armor = event.target.armor.value;
    updatedPlayer.maxArmor = event.target.maxArmor.value;

    // Mise à jour des moves
    Object.keys(updatedPlayer.moves).forEach((move) => {
      updatedPlayer.moves[move].damage = event.target[`${move}Damage`].value;
      updatedPlayer.moves[move].armor = event.target[`${move}Armor`].value;
      updatedPlayer.uses[move] = event.target[`${move}Uses`].value;  // Mise à jour du nombre de 'uses'
      updatedPlayer.cooldowns[move] = event.target[`${move}Cooldown`].value;  // Mise à jour du 'cooldown'
    });

    setPlayer(updatedPlayer);
    setShowPlayerEdit(false);
  };

  const updateEnemyStats = (event) => {
    event.preventDefault();
    const updatedEnemy = { ...enemy };

    // Mise à jour des stats générales
    updatedEnemy.hp = event.target.hp.value;
    updatedEnemy.maxHp = event.target.maxHp.value;
    updatedEnemy.armor = event.target.armor.value;
    updatedEnemy.maxArmor = event.target.maxArmor.value;

    // Mise à jour des moves
    Object.keys(updatedEnemy.moves).forEach((move) => {
      updatedEnemy.moves[move].damage = event.target[`${move}Damage`].value;
      updatedEnemy.moves[move].armor = event.target[`${move}Armor`].value;
      updatedEnemy.uses[move] = event.target[`${move}Uses`].value;  // Mise à jour du nombre de 'uses'
      updatedEnemy.cooldowns[move] = event.target[`${move}Cooldown`].value;  // Mise à jour du 'cooldown'
    });

    setEnemy(updatedEnemy);
    setShowEnemyEdit(false);
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom align="center">Combat Assistant</Typography>

      <Grid container spacing={4}>
        {/* Player Stats */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>⚔️ Player Stats ⚔️</Typography>
              <Typography variant="body1">HP: {player.hp}/{player.maxHp}</Typography>
              <Typography variant="body1">Armor: {player.armor}/{player.maxArmor}</Typography>
              <Typography variant="body1">Move Stats:</Typography>
              {MOVES.map((move) => (
                <Typography key={move} variant="body2">{move.charAt(0).toUpperCase() + move.slice(1)}: Damage {player.moves[move].damage}, Armor {player.moves[move].armor}, Uses {player.uses[move]}, Cooldown {player.cooldowns[move]}</Typography>
              ))}
            </CardContent>
          </Card>
          <Button variant="contained" color="primary" onClick={setShowPlayerEdit}>Set Player</Button>
        </Grid>

        {/* Combat Area */}
        <Grid item xs={12} sm={4} container direction="column" alignItems="center">
          <FormControl fullWidth>
            <InputLabel>Player Move</InputLabel>
            <Select value={playerMove} onChange={(e) => setPlayerMove(e.target.value)} fullWidth>
              {MOVES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Enemy Move</InputLabel>
            <Select value={enemyMove} onChange={(e) => setEnemyMove(e.target.value)} fullWidth>
              {MOVES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleTurn}>Fight!</Button>
          <Button variant="contained" color="secondary" onClick={handleBestMove} startIcon={<SportsScore />} sx={{ mt: 2 }} >Best Move</Button>
          <Button variant="contained" color="secondary" onClick={resetGame} sx={{ mt: 2 }}>Reset Game</Button>
        </Grid>

        {/* Enemy Stats */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>👹 Enemy Stats 👹</Typography>
              <Typography variant="body1">Name: {enemy.name ? enemy.name : "Red Robe"}</Typography>
              <Typography variant="body1">HP: {enemy.hp}/{enemy.maxHp}</Typography>
              <Typography variant="body1">Armor: {enemy.armor}/{enemy.maxArmor}</Typography>
              <Typography variant="body1">Move Stats:</Typography>
              {MOVES.map((move) => (
                <Typography key={move} variant="body2">{move.charAt(0).toUpperCase() + move.slice(1)}: Damage {enemy.moves[move].damage}, Armor {enemy.moves[move].armor}, Uses {enemy.uses[move]}, Cooldown {enemy.cooldowns[move]}</Typography>
              ))}
            </CardContent>
          </Card>
          <Button variant="contained" color="primary" onClick={setShowEnemyEdit}>Set Enemy</Button>
        </Grid>
      </Grid>

      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel id="enemy-select-label">Select Enemy</InputLabel>
        <Select
          labelId="enemy-select-label"
          value=""
          label="Select Enemy"
          onChange={(e) => {
            const selectedEnemy = enemiesList[e.target.value];
            if (selectedEnemy) {
              setEnemy({
                ...selectedEnemy,
                uses: { sword: 3, shield: 3, spell: 3 },
                cooldowns: { sword: 0, shield: 0, spell: 0 }
              });
            }
          }}
        >
          {Object.entries(enemiesList).map(([key, enemy]) => (
            <MenuItem key={key} value={key}>
              {enemy.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {showPlayerEdit && (
        <Paper sx={{ mt: 3, padding: 2 }}>
          <Typography variant="h6">Edit Player Stats</Typography>
          <form onSubmit={updatePlayerStats}>
            <TextField name="hp" label="Player HP" type="number" defaultValue={player.hp} fullWidth margin="normal" />
            <TextField name="maxHp" label="Max HP" type="number" defaultValue={player.maxHp} fullWidth margin="normal" />
            <TextField name="armor" label="Armor" type="number" defaultValue={player.armor} fullWidth margin="normal" />
            <TextField name="maxArmor" label="Max Armor" type="number" defaultValue={player.maxArmor} fullWidth margin="normal" />
            
            {Object.keys(player.moves).map((move) => (
              <Box key={move} display="flex" gap={2} my={1}>
                <TextField name={`${move}Damage`} label={`${move} Damage`} type="number" defaultValue={player.moves[move].damage} />
                <TextField name={`${move}Armor`} label={`${move} Armor`} type="number" defaultValue={player.moves[move].armor} />
                {/* Ajout des champs 'uses' et 'cooldown' */}
                <TextField name={`${move}Uses`} label={`${move} Uses`} type="number" defaultValue={player.uses[move]} />
                <TextField name={`${move}Cooldown`} label={`${move} Cooldown`} type="number" defaultValue={player.cooldowns[move]} />
              </Box>
            ))}

            <Button type="submit" variant="contained" color="success">
              Save Player
            </Button>
          </form>
        </Paper>
      )}

      {showEnemyEdit && (
        <Paper sx={{ mt: 3, padding: 2 }}>
          <Typography variant="h6">Edit Enemy Stats</Typography>
          <form onSubmit={updateEnemyStats}>
            <TextField name="hp" label="Enemy HP" type="number" defaultValue={enemy.hp} fullWidth margin="normal" />
            <TextField name="maxHp" label="Max HP" type="number" defaultValue={enemy.maxHp} fullWidth margin="normal" />
            <TextField name="armor" label="Armor" type="number" defaultValue={enemy.armor} fullWidth margin="normal" />
            <TextField name="maxArmor" label="Max Armor" type="number" defaultValue={enemy.maxArmor} fullWidth margin="normal" />

            {Object.keys(enemy.moves).map((move) => (
              <Box key={move} display="flex" gap={2} my={1}>
                <TextField name={`${move}Damage`} label={`${move} Damage`} type="number" defaultValue={enemy.moves[move].damage} />
                <TextField name={`${move}Armor`} label={`${move} Armor`} type="number" defaultValue={enemy.moves[move].armor} />
                {/* Ajout des champs 'uses' et 'cooldown' */}
                <TextField name={`${move}Uses`} label={`${move} Uses`} type="number" defaultValue={enemy.uses[move]} />
                <TextField name={`${move}Cooldown`} label={`${move} Cooldown`} type="number" defaultValue={enemy.cooldowns[move]} />
              </Box>
            ))}
            
            <Button type="submit" variant="contained" color="success">
              Save Enemy
            </Button>
          </form>
        </Paper>
      )}

  <Paper sx={{ mt: 4, p: 2 }}>
    <Typography variant="h6" gutterBottom>Combat History</Typography>
    {history.map((entry, idx) => (
      <Typography key={idx} variant="body2">
        Round {history.length - idx}: Player used {entry.playerMove}, Enemy used {entry.enemyMove} → Result: {entry.result}
      </Typography>
    ))}
  </Paper>

  <footer style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#999' }}>
    <p>❤️ If you enjoy this tool, you can support my work with crypto donations 🙏 :</p>
    <p>ETH: <code>0xa403c3cbe7f703a1ed8c8ae20dfb0efc7dc5a6dc</code></p>
  </footer>
</Container>
);
}
             
