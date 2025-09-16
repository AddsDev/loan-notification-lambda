const NotifyDecisionUseCase = require("../src/application/NotifyDecisionUseCase");

describe("NotifyDecisionUseCase", () => {
  it("envía correo para APPROVED", async () => {
    const emailMock = { send: jasmine.createSpy("send").and.resolveTo() };
    const useCase = new NotifyDecisionUseCase({ emailPort: emailMock });

    await useCase.execute({
      loanId: "d545796b-5593-4d58-ae97-24cc5feb4cd1",
      email: "user@test.com",
      decision: "APPROVED",
    });

    expect(emailMock.send).toHaveBeenCalled();
    const arg = emailMock.send.calls.argsFor(0)[0];
    expect(arg.subject).toContain("APROBADA");
  });

  it("falla con evento inválido", async () => {
    const emailMock = { send: jasmine.createSpy("send") };
    const useCase = new NotifyDecisionUseCase({ emailPort: emailMock });
    await expectAsync(useCase.execute(null)).toBeRejectedWithError();
    expect(emailMock.send).not.toHaveBeenCalled();
  });

  it("envia correo para REJECTED con motivo", async () => {
    const emailMock = { send: jasmine.createSpy("send").and.resolveTo() };
    const useCase = new NotifyDecisionUseCase({ emailPort: emailMock });

    await useCase.execute({
      loanId: "d545796b-5593-4d58-ae97-24cc5feb4cd1",
      email: "user@test.com",
      decision: "REJECTED",
      reason: "Score bajo",
    });

    const arg = emailMock.send.calls.argsFor(0)[0];
    expect(arg.subject).toContain("RECHAZADA");
    expect(arg.bodyHtml).toContain("Score bajo");
  });

  it("envia correo para REVIEW_MANUAL", async () => {
    const emailMock = { send: jasmine.createSpy("send").and.resolveTo() };
    const useCase = new NotifyDecisionUseCase({ emailPort: emailMock });

    await useCase.execute({
      loanId: "d545796b-5593-4d58-ae97-24cc5feb4cd1",
      email: "user@test.com",
      decision: "REVIEW_MANUAL",
      reason: "Score bajo",
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
    });

    const arg = emailMock.send.calls.argsFor(0)[0];
    expect(arg.subject).toContain("Decisión de tu solicitud");
    expect(arg.bodyHtml).toContain("Plan de pagos estimado");
  });
});
