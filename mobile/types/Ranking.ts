export default interface Ranking {
  id: number;
  prevRanking: Ranking | null;
  isbn: string;
}
