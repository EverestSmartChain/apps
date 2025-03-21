// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/apps/blob/main/LICENSE)

import { BigNumber } from "@ethersproject/bignumber";

type AmountProposal = {
  denom: string;
  amount: string;
};

type MessageProposal = {
  "@type": string;
  authority: string;
  content: {
    "@type": string;
    amount: null | AmountProposal[];
    description: string;
    recipient: string;
    title: string;
  };
};

export type V1Proposals = {
  proposals: Proposal[];
  tally_params: TallyingProps;
};

export type Proposal = {
  deposit_end_time: string;
  final_tally_result: {
    yes_count: string;
    no_count: string;
    abstain_count: string;
    no_with_veto_count: string;
  };
  id: string;
  messages: MessageProposal[];
  status: string;
  submit_time: string;
  total_deposit: AmountProposal[];
  voting_end_time: string;
  voting_start_time: string;
  title: string;
  summary: string;
};

export type ProposalProps = {
  id: string;
  title: string;
  status: string;
  votingStartTime: string;
  votingEndTime: string;
  tallyResults: string[];
};
// actualizar estos
export const PROPOSAL_STATUS_REJECTED = "PROPOSAL_STATUS_REJECTED";
export const PROPOSAL_STATUS_PASSED = "PROPOSAL_STATUS_PASSED";
export const PROPOSAL_STATUS_VOTING_PERIOD = "PROPOSAL_STATUS_VOTING_PERIOD";
export const PROPOSAL_STATUS = {
  PROPOSAL_STATUS_UNSPECIFIED: "Default",
  PROPOSAL_STATUS_DEPOSIT_PERIOD: "Deposit",
  PROPOSAL_STATUS_VOTING_PERIOD: "Voting",
  PROPOSAL_STATUS_PASSED: "Passed",
  PROPOSAL_STATUS_REJECTED: "Rejected",
  PROPOSAL_STATUS_FAILED: "Failed",
};

export const PROPOSAL_DISPLAY_MAPPING: Record<string, string> = {
  PROPOSAL_STATUS_UNSPECIFIED: "Default",
  PROPOSAL_STATUS_DEPOSIT_PERIOD: "Deposit",
  PROPOSAL_STATUS_VOTING_PERIOD: "Voting",
  PROPOSAL_STATUS_PASSED: "Passed",
  PROPOSAL_STATUS_REJECTED: "Rejected",
  PROPOSAL_STATUS_FAILED: "Failed",
};

export type TallyingProps = {
  quorum: string;
  threshold: string;
  veto_threshold: string;
};

export type ProposalDetailProps = {
  id: string;
  title: string;
  status: string;
  votingStartTime: string;
  votingEndTime: string;
  tallyResults: string[];
  tallyPercents: number[];
  tallying: TallyingProps;
  type: string;
  totalDeposit: string;
  submitTime: string;
  depositEndTime: string;
  description: string;
  total: BigNumber;
  isVotingTimeWithinRange: boolean;
};

export const lookupProposalEndStatus: { [key: string]: string } = {
  0: "Passed",
  2: "Abstain",
  1: "No",
  3: "No With Veto",
};

export const optionVoteSelected: { [key: string]: number } = {
  Yes: 1,
  Abstain: 2,
  No: 3,
  "No with Veto": 4,
};

interface VotingReference {
  [key: string]: string;
}

export const VOTING_LOOKUP: VotingReference = {
  VOTE_OPTION_YES: "Yes",
  VOTE_OPTION_ABSTAIN: "Abstain",
  VOTE_OPTION_NO: "No",
  VOTE_OPTION_NO_WITH_VETO: "No with Veto",
};

type OptionsVoteResponse = {
  option: string;
  weight: string;
};

export type VoteResponse = {
  vote: {
    proposal_id: string;
    voter: string;
    option: string;
    options: OptionsVoteResponse[];
  };
};
