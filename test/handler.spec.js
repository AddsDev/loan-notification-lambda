const handler = require("../src/handler");

const NotifyDecisionUseCase = require("../src/application/NotifyDecisionUseCase");
const realUc = NotifyDecisionUseCase.prototype.execute;

describe("Lambda handler (SQS)", () => {
  beforeAll(() => {
    NotifyDecisionUseCase.prototype.execute = jasmine
      .createSpy("execute")
      .and.callFake(async (evt) => {
        if (evt.solicitudId === "bad") throw new Error("Error");
      });
  });

  afterAll(() => {
    NotifyDecisionUseCase.prototype.execute = realUc;
  });

  it("retorna partial batch failures cuando un record falla", async () => {
    const event = {
      Records: [
        {
          messageId: "messageId1",
          body: JSON.stringify({
            eventName: "SolicitudDecision",
            eventVersion: 1,
            loanId: "d545796b-5593-4d58-ae97-24cc5feb4cd1",
            email: "a@b.com",
            decision: "APPROVED",
            createdAt: "2025-09-13T15:12:00Z",
          }),
        },
        {
          messageId: "messageId2",
          body: JSON.stringify({
            eventName: "SolicitudDecision",
            eventVersion: 1,
            loanId: "d545796b",
            email: "a@b.com",
            decision: "REJECTED",
            createdAt: "2025-09-13T15:12:00Z",
          }),
        },
        {
          messageId: "messageId2",
          body: JSON.stringify({
            eventName: "SolicitudDecision",
            eventVersion: 1,
            loanId: "d545796b-5593-4d58-ae97-24cc5feb4cd1",
            email: "a@b.com",
            decision: "REVIEW_MANUAL",
            createdAt: "2025-09-13T15:12:00Z",
            payload: {
              payload: {
                decision: "REVIEW_MANUAL",
                maximunCapacity: 6_500_000,
                currentMonthlyDebt: 2_300_300,
                capacityAvailable: 2_500_000,
                feeNew: 1230974.28,
                schedule: [
                  {
                    month: 1,
                    fee: 1230974.28,
                    interest: 644000,
                    capitalPayment: 586974.28,
                    finalBalance: 1713025.72,
                  },
                  {
                    month: 2,
                    fee: 1230974.28,
                    interest: 479647.2,
                    capitalPayment: 751327.08,
                    finalBalance: 961698.64,
                  },
                  {
                    month: 3,
                    fee: 1230974.28,
                    interest: 269275.62,
                    capitalPayment: 961698.64,
                    finalBalance: 0,
                  },
                ],
              },
            },
          }),
        },
      ],
    };

    const res = await handler.handler(event);
    expect(res.batchItemFailures.length).toBe(1);
    expect(res.batchItemFailures[0].itemIdentifier).toBe("messageId2");
  });
});
