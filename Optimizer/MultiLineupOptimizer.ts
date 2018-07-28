import {FantasyLineup} from '../lib/FantasyLineup'
import {Player} from '../lib/Player'
import {IsValidFunction} from './IsValidFunction'
import {SingleLineupOptimizer} from './SingleLineupOptimizer'


export class MultiLineupOptimizer {
  private playerPool: Player[]
  private salaryCap: number
  private rosterSpots: number
  private isValid: IsValidFunction
  private isRunning: boolean = false
  private optimals: FantasyLineup[]

  constructor(playerPool: Player[], salaryCap: number, rosterSpots: number, isValid: IsValidFunction = () => true, onNewLineup: (lineup: FantasyLineup[]) => any) {
    this.playerPool = playerPool
    this.salaryCap = salaryCap
    this.rosterSpots = rosterSpots
    this.isValid = isValid
  }

  public start = async (n: number): Promise<void> => {
    if (this.isRunning) {
      throw new Error('cannot start twice')
    }
    await this.findOptimals(n)
  }

  public stop = (): void => {
    this.isRunning = false
  }

  private findOptimals = async (n: number): Promise<(FantasyLineup)[]> => {
    if (!this.isRunning || n === this.optimals.length) {
      return this.optimals
    }
    const optimizer = new SingleLineupOptimizer(this.playerPool, this.salaryCap, this.rosterSpots, (lineup: FantasyLineup) => this.isUniqueAndValid(lineup))
  }

  private isUniqueAndValid: IsValidFunction = (lineup: FantasyLineup) => {
    return this.isValid(lineup) && this.isUnique(lineup)
  }

  private isUnique: IsValidFunction = (): IsValidFunction => {
    const isUnique: IsValidFunction = (lineup: FantasyLineup) => {
      const lineupsByKey: {[key: string]: FantasyLineup} = {}
    }
    return isUnique
  }
}

