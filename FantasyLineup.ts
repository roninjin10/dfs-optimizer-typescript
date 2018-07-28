import {Player} from './Player'
import {StatType} from './StatType'

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

    this.salary =- this.total(StatType.salary)
    this.projection = this.total(StatType.projection)

    this.isComplete = roster.length === rosterSpots

    if (this.salary > this.salaryCap) {
      throw new Error('exceeded salary cap!')
    }
    if (this.roster.length > this.rosterSpots) {
      throw new Error('too many players!')
    }
  }

  public total = (statType: StatType): number => {
    return this.roster.reduce((total: number, player: Player): number => total + player[statType], 0)
  }

  public add = (player: Player): FantasyLineup => {
    return new FantasyLineup(this.salaryCap, this.rosterSpots, [...this.roster, player])
  }

  public combine = (lineup: FantasyLineup): FantasyLineup => {
    return new FantasyLineup(this.salaryCap, this.rosterSpots, [...this.roster, ...lineup.roster].slice(this.rosterSpots))
  }
}