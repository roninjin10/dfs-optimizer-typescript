import {Memoizer} from './Memoizer'
import {FantasyLineup} from './FantasyLineup'
import {Player} from './Player'

enum InvalidLineup {
  OVER_SALARY = 'OVER_SALARY',
  RAN_OUT_OF_PLAYERS = 'RAN_OUT_OF_PLAYERS',
  FAILED_IS_VALID = 'FAILED_IS_VALID',
}

interface LineupIfTakeOrPass {
  lineupIfTake: FantasyLineup | InvalidLineup
  lineupIfPass: FantasyLineup | InvalidLineup
}

const isTypeOfInvalidLineup = (a: any) => Object.keys(InvalidLineup).some(l => l === a)

type IsValidFunction = (lineup: FantasyLineup) => boolean

export class SingleLineupOptimizer {
  private playerPool: Player[]
  private salaryCap: number
  private rosterSpots: number
  private memoizer: Memoizer = new Memoizer()
  private isValid: IsValidFunction

  constructor(playerPool: Player[], salaryCap: number, rosterSpots: number, isValid: IsValidFunction = () => true) {
    this.playerPool = playerPool
    this.salaryCap = salaryCap
    this.rosterSpots = rosterSpots
    this.isValid = isValid
  }

  public findOptimal = (): FantasyLineup | InvalidLineup => {
    const out = this.traverseTakeOrNotTakeTree(0, new FantasyLineup(this.salaryCap, this.rosterSpots, []))
    if (!out) {
      throw new Error('unable to find lineup')
    }
    return out
  }

  private traverseTakeOrNotTakeTree = (currentPoolIndex: number, currentLineup: FantasyLineup): FantasyLineup | InvalidLineup => {
    const PLAYERS_LEFT = this.playerPool.length - currentPoolIndex
    const SALARY_LEFT = this.salaryCap - currentLineup.salary
    const ROSTER_SPOTS_LEFT = this.rosterSpots - currentLineup.roster.length
    const IS_MEMOIZED = this.memoizer.isMemoized(PLAYERS_LEFT, SALARY_LEFT, ROSTER_SPOTS_LEFT)

    if (currentLineup.isComplete) {
      if (!this.isValid(currentLineup)) {
        return InvalidLineup.FAILED_IS_VALID
      }
      return currentLineup
    }

    if (IS_MEMOIZED) {
      const memoizedLineup = this.memoizer.getLineup(PLAYERS_LEFT, SALARY_LEFT, ROSTER_SPOTS_LEFT)
      if (isTypeOfInvalidLineup(memoizedLineup)) {
        return memoizedLineup
      }
      return currentLineup.combine(memoizedLineup)
    }

    const {lineupIfTake, lineupIfPass} = this.findLineupIfTakeAndPass(currentPoolIndex, currentLineup)
    return this.bestLineup({lineupIfTake, lineupIfPass})
  }

  bestLineup = (lineups: LineupIfTakeOrPass): FantasyLineup | InvalidLineup => {
    const {lineupIfTake, lineupIfPass} = lineups

    if (isTypeOfInvalidLineup(lineupIfPass)) {
      return lineupIfTake
    }
    if (isTypeOfInvalidLineup(lineupIfTake)) {
      return lineupIfPass
    }

    return (lineupIfTake as FantasyLineup).projection > (lineupIfPass as FantasyLineup).projection
      ? lineupIfTake
      : lineupIfPass
  }


  private findLineupIfTakeAndPass = (currentPoolIndex: number, currentLineup: FantasyLineup): LineupIfTakeOrPass => {
    const lineupIfPass: FantasyLineup | InvalidLineup = this.traverseTakeOrNotTakeTree(currentPoolIndex + 1, currentLineup)

    const currentPlayer: Player = this.playerPool[currentPoolIndex]
    let addPlayer: FantasyLineup | InvalidLineup = currentLineup.add(currentPlayer)
    let lineupIfTake: FantasyLineup | InvalidLineup = isTypeOfInvalidLineup(addPlayer)
      ? addPlayer
      : this.traverseTakeOrNotTakeTree(currentPoolIndex + 1, addPlayer)

    return {lineupIfTake, lineupIfPass}
  }
}

