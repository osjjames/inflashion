export type Day = number;

export type Stake = {
    amount: number,
    duration: number,
    startDay: Day,
    endDay: Day,
    flashYield: number
}

export type Unstake = {
    stake: Stake,
    day: Day,
    burned: number
}

export type Protocol = {
    totalSupply: number,
    totalStaked: number,
    fpy: number
}

const stake = (amount: number, duration: number, protocol: Protocol, currentDay: Day): Stake => ({
    amount,
    duration,
    startDay: currentDay,
    endDay: currentDay + duration,
    flashYield: (amount * duration * protocol.fpy) / 365
});

const unstake = (stake: Stake, protocol: Protocol, currentDay: Day): Unstake => ({
    stake,
    day: currentDay,
    burned: ((stake.amount * (currentDay - stake.startDay)) / stake.duration) * ((protocol.totalStaked - stake.amount) / protocol.totalSupply)
});

export const updateProtocolFromStake = (stake: Stake) => (protocol: Protocol): Protocol => ({
    totalSupply: protocol.totalSupply + stake.flashYield,
    totalStaked: protocol.totalStaked + stake.amount,
    fpy: (1 - ((protocol.totalStaked + stake.amount) / protocol.totalSupply)) / 2
});

export const updateProtocolFromUnstake = (unstake: Unstake) => (protocol: Protocol): Protocol => ({
    totalSupply: protocol.totalSupply - unstake.burned,
    totalStaked: protocol.totalStaked - unstake.stake.amount,
    fpy: protocol.fpy
});

export const updateProtocolFromStakeEnd = (stake: Stake) => (protocol: Protocol): Protocol => ({
    totalSupply: protocol.totalSupply,
    totalStaked: protocol.totalStaked - stake.amount,
    fpy: protocol.fpy
});

const remainingStakeDuration = (stake: Stake, currentDay: Day) => stake.endDay - currentDay;