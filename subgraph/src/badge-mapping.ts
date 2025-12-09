import { BigInt } from "@graphprotocol/graph-ts"
import { BadgeMinted } from "../generated/SimpleZKBadge/SimpleZKBadge"
import { Badge, User, GlobalStats, DailyStats } from "../generated/schema"

export function handleBadgeMinted(event: BadgeMinted): void {
  let badgeId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  let badge = new Badge(badgeId)
  badge.tokenId = event.params.tokenId
  badge.owner = event.params.to.toHexString()
  badge.badgeType = event.params.badgeType
  badge.zkProofHash = event.params.zkProofHash
  badge.issuedAt = event.block.timestamp
  badge.txHash = event.transaction.hash
  badge.blockNumber = event.block.number
  badge.save()

  let userId = event.params.to.toHexString()
  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
    user.address = event.params.to
    user.totalBadges = BigInt.fromI32(0)
    user.totalPassports = BigInt.fromI32(0)
    user.createdAt = event.block.timestamp
    user.lastActivity = event.block.timestamp
    
    let stats = getOrCreateGlobalStats()
    stats.totalUsers = stats.totalUsers.plus(BigInt.fromI32(1))
    stats.save()
  }
  user.totalBadges = user.totalBadges.plus(BigInt.fromI32(1))
  user.lastActivity = event.block.timestamp
  user.save()

  let stats = getOrCreateGlobalStats()
  stats.totalBadges = stats.totalBadges.plus(BigInt.fromI32(1))
  stats.lastUpdated = event.block.timestamp
  stats.save()

  updateDailyStats(event.block.timestamp, "badge")
}

function getOrCreateGlobalStats(): GlobalStats {
  let stats = GlobalStats.load("global")
  if (stats == null) {
    stats = new GlobalStats("global")
    stats.totalBadges = BigInt.fromI32(0)
    stats.totalPassports = BigInt.fromI32(0)
    stats.totalUsers = BigInt.fromI32(0)
    stats.totalScoreUpdates = BigInt.fromI32(0)
    stats.averageCreditScore = BigInt.fromI32(0)
    stats.lastUpdated = BigInt.fromI32(0)
  }
  return stats
}

function updateDailyStats(timestamp: BigInt, type: string): void {
  let dayId = timestamp.toI32() / 86400
  let dailyStats = DailyStats.load(dayId.toString())
  if (dailyStats == null) {
    dailyStats = new DailyStats(dayId.toString())
    dailyStats.date = dayId
    dailyStats.badgesMinted = BigInt.fromI32(0)
    dailyStats.passportsIssued = BigInt.fromI32(0)
    dailyStats.scoreUpdates = BigInt.fromI32(0)
    dailyStats.newUsers = BigInt.fromI32(0)
  }
  if (type == "badge") {
    dailyStats.badgesMinted = dailyStats.badgesMinted.plus(BigInt.fromI32(1))
  }
  dailyStats.save()
}
