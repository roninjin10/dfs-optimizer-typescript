import {NBATeam} from './NBATeam'

export interface Player {
  name: string
  salary: number
  projection: number
  team: NBATeam
}