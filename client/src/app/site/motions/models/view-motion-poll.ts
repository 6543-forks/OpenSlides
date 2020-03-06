import { MotionPoll, MotionPollMethod } from 'app/shared/models/motions/motion-poll';
import { PercentBase } from 'app/shared/models/poll/base-poll';
import { BaseViewModel } from 'app/site/base/base-view-model';
import { ProjectorElementBuildDeskriptor } from 'app/site/base/projectable';
import { ViewMotionOption } from 'app/site/motions/models/view-motion-option';
import { PollClassType, PollTableData, ViewBasePoll, VotingResult } from 'app/site/polls/models/view-base-poll';
import { ViewMotion } from './view-motion';

export interface MotionPollTitleInformation {
    title: string;
}

export const MotionPollMethodVerbose = {
    YN: 'Yes/No',
    YNA: 'Yes/No/Abstain'
};

export const MotionPollPercentBaseVerbose = {
    YN: 'Yes/No',
    YNA: 'Yes/No/Abstain',
    valid: 'All valid ballots',
    cast: 'All casted ballots',
    disabled: 'Disabled (no percents)'
};

export class ViewMotionPoll extends ViewBasePoll<MotionPoll, MotionPollMethod, PercentBase>
    implements MotionPollTitleInformation {
    public static COLLECTIONSTRING = MotionPoll.COLLECTIONSTRING;
    protected _collectionString = MotionPoll.COLLECTIONSTRING;

    public readonly pollClassType = PollClassType.Motion;

    public get result(): ViewMotionOption {
        return this.options[0];
    }

    public get hasPresentableValues(): boolean {
        return this.result.hasPresentableValues;
    }

    public get hasVotes(): boolean {
        return this.result && !!this.result.votes.length;
    }

    public getContentObject(): BaseViewModel {
        return this.motion;
    }

    public generateTableData(): PollTableData[] {
        let tableData: PollTableData[] = this.options.flatMap(vote =>
            this.voteTableKeys.map(key => this.createTableDataEntry(key, vote))
        );
        tableData.push(...this.sumTableKeys.map(key => this.createTableDataEntry(key)));

        tableData = tableData.filter(localeTableData => !localeTableData.value.some(result => result.hide));

        return tableData;
    }

    private createTableDataEntry(result: VotingResult, vote?: ViewMotionOption): PollTableData {
        return {
            votingOption: result.vote,
            value: [
                {
                    amount: vote ? vote[result.vote] : this[result.vote],
                    hide: result.hide,
                    icon: result.icon,
                    showPercent: result.showPercent
                }
            ]
        };
    }

    public getSlide(): ProjectorElementBuildDeskriptor {
        return {
            getBasicProjectorElement: options => ({
                name: MotionPoll.COLLECTIONSTRING,
                id: this.id,
                getIdentifiers: () => ['name', 'id']
            }),
            slideOptions: [],
            projectionDefaultName: 'motion_poll',
            getDialogTitle: this.getTitle
        };
    }

    public get pollmethodVerbose(): string {
        return MotionPollMethodVerbose[this.pollmethod];
    }

    public get percentBaseVerbose(): string {
        return MotionPollPercentBaseVerbose[this.onehundred_percent_base];
    }

    public anySpecialVotes(): boolean {
        return this.result.yes < 0 || this.result.no < 0 || this.result.abstain < 0;
    }
}

export interface ViewMotionPoll extends MotionPoll {
    motion: ViewMotion;
    options: ViewMotionOption[];
}