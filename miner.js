const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const { GoalBlock } = goals
const Vec3 = require('vec3')

// 🟩 EDIT THIS — your Aternos server + your Minecraft username
// Optional: add `version` if auto-detection fails. Example: "1.20.2"
const SERVER = {
  host: 'STFU-V0SI.aternos.me',
  port: 32288,
  username: 'AutoMiner',
  version: '1.21.1',
  auth: 'offline'
}
const OWNER = 'woopsyy69' // 🔹 replace with your in-game name


const mcproto = require('minecraft-protocol')

// Try to auto-detect a compatible Java edition version by pinging the server
async function detectVersion(host, port, candidates = ['1.21.9','1.21.1','1.20.4','1.20.2','1.19.4','1.18.2']) {
  for (const v of candidates) {
    try {
      const res = await new Promise((resolve, reject) => {
        mcproto.ping({ host, port, version: v }, (err, res) => {
          if (err) return reject(err)
          resolve(res)
        })
      })
      // sometimes the server responds with its precise version name/protocol
      if (res && res.version && res.version.protocol) {
        console.log('Ping response for', v, '->', res.version)
        return { version: v, protocol: res.version.protocol }
      }
      console.log('Detected compatible version:', v)
      return { version: v }
    } catch (e) {
      // continue
    }
  }
  return { version: SERVER.version || '1.20.2' }
}

const createOptions = Object.assign({}, SERVER)
detectVersion(SERVER.host, SERVER.port).then((res) => {
  // res is { version, protocol? }
  createOptions.version = res.version
  if (res.protocol) createOptions.protocolVersion = res.protocol
  console.log('Creating bot with version:', createOptions.version, 'protocol:', createOptions.protocolVersion)
  const bot = mineflayer.createBot(createOptions)
  bot.loadPlugin(pathfinder)

  // re-export bot for the rest of the file (attach to global scope)
  global.__BOT__ = bot
  attachBotHandlers(bot)
}).catch((err) => {
  console.error('Version detection failed, creating bot with default version. Error:', err)
  createOptions.version = SERVER.version || '1.20.2'
  const bot = mineflayer.createBot(createOptions)
  bot.loadPlugin(pathfinder)
  global.__BOT__ = bot
  attachBotHandlers(bot)
})

function attachBotHandlers(bot) {
  const targetOres = [
    'coal_ore', 'iron_ore', 'gold_ore', 'redstone_ore', 'diamond_ore',
    'deepslate_coal_ore', 'deepslate_iron_ore', 'deepslate_gold_ore',
    'deepslate_redstone_ore', 'deepslate_diamond_ore'
  ]
  const dangerBlocks = ['lava', 'flowing_lava', 'fire', 'cactus']

  let mcData, defaultMove

  bot.once('spawn', () => {
    mcData = require('minecraft-data')(bot.version)
    defaultMove = new Movements(bot, mcData)

    // Avoid lava
    dangerBlocks.forEach(b => {
      const block = mcData.blocksByName[b]
      if (block) defaultMove.blocksCantBreak.add(block.id)
    })

    bot.pathfinder.setMovements(defaultMove)
    bot.chat('✅ AutoMiner online! (Only my owner can control me)')
  })

  // Better error reporting for connection / protocol issues
  bot.on('error', (err) => {
    console.error('Bot error:', err && err.message ? err.message : err)
    // If the error looks like the unsupported protocol ping error, give guidance
    if (err && /Unsupported protocol version/.test(String(err.message))) {
      console.error('\nIt looks like automatic protocol detection failed. Try setting the explicit version in the SERVER object at the top of `miner.js` (for example: version: "1.20.2").')
    }
  })

  // Extra diagnostics: connection lifecycle events
  bot.on('connect', () => console.log('DEBUG: socket connect event'))
  bot.on('end', (reason) => console.log('DEBUG: connection ended:', reason))
  bot.on('kick', (reason) => console.log('DEBUG: kicked from server:', reason))
  bot.on('login', () => console.log('DEBUG: login event'))
  bot.on('spawn', () => console.log('DEBUG: spawn event'))

  // 🎮 Listen for chat commands
  bot.on('chat', async (username, message) => {
    if (username !== OWNER) return // Ignore everyone except the owner
    if (username === bot.username) return // Ignore itself

    const args = message.trim().split(' ')
    const cmd = args[0].toLowerCase()

    if (cmd === '/mine' && args[1]) {
      const oreName = args[1].toLowerCase() + '_ore'
      bot.chat(`⛏️ Searching for ${oreName}...`)
      await mineOre(oreName)
    }

    else if (cmd === '/top') {
      const topY = bot.world.getHighestBlockAt(bot.entity.position.x, bot.entity.position.z).position.y
      bot.chat(`🚀 Going to surface (Y: ${topY})`)
      await bot.pathfinder.goto(new GoalBlock(
        Math.floor(bot.entity.position.x),
        topY,
        Math.floor(bot.entity.position.z)
      ))
      bot.chat('✅ Arrived at top!')
    }

    else if (cmd === '/start' && args[1]) {
      const targetY = parseInt(args[1])
      if (isNaN(targetY)) return bot.chat('⚠️ Invalid Y level.')
      bot.chat(`🪜 Digging staircase down to Y=${targetY}`)
      await digStaircase(targetY)
      bot.chat('✅ Reached target Y level!')
    }
  })

  // 🪨 Mine specific ore
  async function mineOre(oreName) {
    const ore = bot.findBlock({
      matching: block => mcData.blocks[block.type].name === oreName,
      maxDistance: 64
    })

    if (!ore) {
      bot.chat('❌ Ore not found nearby.')
      return
    }

    if (isDangerNearby(ore.position)) {
      bot.chat('⚠️ Lava nearby — skipping!')
      return
    }

    await bot.pathfinder.goto(new GoalBlock(ore.position.x, ore.position.y, ore.position.z))
    await bot.dig(bot.blockAt(ore.position))
    bot.chat('✅ Ore mined successfully!')
  }

  // 🪜 Dig staircase to a specific Y level
  async function digStaircase(targetY) {
    let pos = bot.entity.position.clone()
    while (pos.y > targetY) {
      const blockBelow = bot.blockAt(pos.offset(0, -1, 0))
      const blockDiag = bot.blockAt(pos.offset(1, -1, 0))

      if (blockBelow && blockBelow.diggable) await bot.dig(blockBelow)
      if (blockDiag && blockDiag.diggable) await bot.dig(blockDiag)

      pos = pos.offset(1, -1, 0)
      await bot.pathfinder.goto(new GoalBlock(pos.x, pos.y, pos.z))
      await bot.waitForTicks(10)
    }
  }

  // 🧱 Check for lava nearby
  function isDangerNearby(position) {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const block = bot.blockAt(position.offset(x, y, z))
          if (block && dangerBlocks.includes(mcData.blocks[block.type].name)) {
            return true
          }
        }
      }
    }
    return false
  }

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason)
  })
}
