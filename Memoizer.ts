import {FantasyLineup} from './FantasyLineup'

export class Memoizer {
  private memoized: { [s: string]: FantasyLineup} = {}

  public isMemoized = (playersLeft: number, salaryLeft: number, rosterSpotsLeft: number): boolean => {
    const key = this.createKey(playersLeft, salaryLeft, rosterSpotsLeft)
    return !!this.memoized[key]
  }

  public getLineup = (playersLeft: number, salaryLeft: number, rosterSpotsLeft: number): FantasyLineup => {
    if (!this.isMemoized(playersLeft, salaryLeft, rosterSpotsLeft)){
      throw new Error(`cannot getLineup with playersLeft salaryLeft and rosterSpotsLeft that aren't memoized`)
    }
    const key = this.createKey(playersLeft, salaryLeft, rosterSpotsLeft)
    return this.memoized[key]
  }

  public memoize = (playersLeft: number, salaryLeft: number, rosterSpotsLeft: number, lineup: FantasyLineup): Memoizer => {
    const key = this.createKey(playersLeft, salaryLeft, rosterSpotsLeft)
    this.memoized[key] = lineup
    return this
  }

  private createKey = (playersLeft: number, salaryLeft: number, rosterSpotsLeft: number): string => (`
    playersLeft: ${playersLeft}
    salaryLeft: ${salaryLeft}
    rosterSpotsLeft: ${rosterSpotsLeft}
  `)
}