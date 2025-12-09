import { BigInt } from "@graphprotocol/graph-ts"
import { PassportIssued, ScoreUpdated } from "../generated/CreditPassport/CreditPassport"
import { Passport, ScoreUpdate, User, GlobalStats, DailyStats } from "../generated/schema"

export function handlePassportIssued(event: PassportIssued): void {
  let passportId = event.params.tokenId.toString()
  let passport = new Passport(passportId)
  passport.tokenId = event.params.tokenId
  passport.owner = event.params.owner.toHexString()
  passport.creditScore = event.params.creditScore
  passport.pohScore = BigInt.fromI32(0)
  passport.badgeCount = BigInt.fromI32(0)
  passport.onchainActivity = BigInt.fromI32(0)
  passport.issuedAt = event.block.timestamp
  passport.lastUpdated = event.block.timestamp
  passport.txHash = event.transaction.hash
  passport.blockNumber = event.block.number
  passport.save()

  let userId = event.params.owner.toHexString()
  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
    user.address = event.params.owner
    user.totalBadges = BigInt.fromI32(0)
    user.totalPassports = BigInt.fromI32(0)
    user.createdAt = event.block.timestamp
    user.lastActivity = event.block.timestamp
  }
  user.totalPassports = user.totalPassports.plus(BigInt.fromI32(1))
  user.lastActivity = event.block.timestamp
  user.save()

  let stats = getOrCreateGlobalStats()
  stats.totalPassports = stats.totalPassports.plus(BigInt.fromI32(1))
  stats.lastUpdated = event.block.timestamp
  
  let totalScore = stats.averageCreditScore.times(stats.totalPassports.minus(BigInt.fromI32(1)))
  totalScore = totalScore.plus(event.params.creditScore)
  stats.averageCreditScore = totalScore.div(stats.totalPassports)
  stats.save()

  updateDailyStats(event.block.timestamp, "passport")
}

export function handleScoreUpdated(event: ScoreUpdated): void {
  let passportId = event.params.tokenId.toString()
  let passport = Passport.load(passportId)
  if (passport != null) {
    let updateId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
    let update = new ScoreUpdate(updateId)
    update.passport = passport.id
    update.oldScore = passport.creditScore
    update.newScore = event.params.newScore
    update.timestamp = event.block.timestamp
    update.txHash = event.transaction.hash
    update.blockNumber = event.block.number
    update.save()

    passport.creditScore = event.params.newScore
    passport.lastUpdated = event.block.timestamp
    passport.save()

    let stats = getOrCreateGlobalStats()
    stats.totalScoreUpdates = stats.totalScoreUpdates.plus(BigInt.fromI32(1))
    stats.lastUpdated = event.block.timestamp
    stats.save()

    updateDailyStats(event.block.timestamp, "score")
  }
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
  if (type == "passport") {
    dailyStats.passportsIssued = dailyStats.passportsIssued.plus(BigInt.fromI32(1))
  } else if (type == "score") {
    dailyStats.scoreUpdates = dailyStats.scoreUpdates.plus(BigInt.fromI32(1))
  }
  dailyStats.save()
}
