export type Stake = {
    amount: number,
    duration: number,
    startDay: number,
    endDay: number,
    flashYield: number
}

export type Unstake = {
    stake: Stake,
    day: number,
    burned: number
}

export type Protocol = {
    totalSupply: number,
    totalStaked: number,
    fpy: number
}

const stake = (amount: number, duration: number, protocol: Protocol, currentDay: number): Stake => ({
    amount,
    duration,
    startDay: currentDay,
    endDay: currentDay + duration,
    flashYield: (amount * duration * protocol.fpy) / 365
});

const unstake = (stake: Stake, protocol: Protocol, currentDay: number): Unstake => ({
    stake,
    day: currentDay,
    burned: ((stake.amount * (currentDay - stake.startDay)) / stake.duration) * ((protocol.totalStaked - stake.amount) / protocol.totalSupply)
});

const updateProtocolFromStake = (protocol: Protocol, stake: Stake): Protocol => ({
    totalSupply: protocol.totalSupply + stake.flashYield,
    totalStaked: protocol.totalStaked + stake.amount,
    fpy: (1 - ((protocol.totalStaked + stake.amount) / protocol.totalSupply)) / 2
});

const updateProtocolFromUnstake = (protocol: Protocol, unstake: Unstake): Protocol => ({
    totalSupply: protocol.totalSupply - unstake.burned,
    totalStaked: protocol.totalStaked - unstake.stake.amount,
    fpy: protocol.fpy
});

const updateProtocolFromStakeEnd = (protocol: Protocol, stake: Stake): Protocol => ({
    totalSupply: protocol.totalSupply,
    totalStaked: protocol.totalStaked - stake.amount,
    fpy: protocol.fpy
});

const remainingStakeDuration = (stake: Stake, currentDay: number) => stake.endDay - currentDay;