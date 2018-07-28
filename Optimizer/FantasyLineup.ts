import {Player} from '../constants/Player'
import {FantasyStat} from '../constants/Stats'

export enum InvalidLineup {
  OVER_SALARY = 'OVER_SALARY',
  RAN_OUT_OF_PLAYERS = 'RAN_OUT_OF_PLAYERS',
  FAILED_IS_VALID = 'FAILED_IS_VALID',
  TOO_MANY_PLAYERS = 'TOO_MANY_PLAYERS',
}

export class FantasyLineup {
  public salaryCap: number
  public rosterSpots: number
  public roster: Player[]
  public salary: number
  public projection: number
  public isComplete: boolean

  constructor(salaryCap: number, rosterSpots: number, roster: Player[]) {
    this.salaryCap = salaryCap
    this.rosterSpots = rosterSpots

    this.roster = roster

    this.salary =- this.total(FantasyStat.salary)
    this.projection = this.total(FantasyStat.projection)

    this.isComplete = roster.length === rosterSpots

    if (this.salary > this.salaryCap) {
      throw new Error(InvalidLineup.OVER_SALARY)
    }
    if (this.roster.length > this.rosterSpots) {
      throw new Error(InvalidLineup.TOO_MANY_PLAYERS)
    }
  }

  public total = (statType: FantasyStat): number => {
    return this.roster.reduce((total: number, player: Player): number => total + player[statType], 0)
  }

  public add = (player: Player): FantasyLineup | InvalidLineup => {
    try {
      return new FantasyLineup(this.salaryCap, this.rosterSpots, [...this.roster, player])
    } catch(invalidLineupError) {
      return invalidLineupError as InvalidLineup
    }
  }

  public combine = (lineup: FantasyLineup): FantasyLineup | InvalidLineup => {
    try {
      return new FantasyLineup(this.salaryCap, this.rosterSpots, [...this.roster, ...lineup.roster].slice(this.rosterSpots))
    } catch(invalidLineupError) {
      return invalidLineupError as InvalidLineup
    }
  }
}