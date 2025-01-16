import { defineStore } from 'pinia';

export interface FormStore {
  totalSteps: number;
  currentStep: number;
  formContent: any[];
  notApplicableFields: any;
}

export const useFormStore = defineStore({
  id: 'form',
  state: () =>
    ({
      totalSteps: 0,
      currentStep: 0,
      formContent: [],
      notApplicableFields: {}
    }) as FormStore,
  actions: {
    reset(): void {
      this.totalSteps = 0;
      this.currentStep = 0;
      this.formContent = [];
      this.notApplicableFields = {};
    },
    setTotalSteps(total: number): void {
      this.totalSteps = total;
    },
    setNotApplicableFields(fields: object): void {
      this.notApplicableFields = fields;
    },
    setCurrentStep(current: number): void {
      this.currentStep = current;
    },
    setFormContent(content: any[]): void {
      this.formContent = content;
    },
    next(content: any): void {
      if (this.formContent[this.currentStep]) {
        this.formContent[this.currentStep] = content;
      } else {
        this.formContent.push(content);
      }

      if (this.currentStep + 1 === this.totalSteps) {
        console.log(this.formContent[0]);
        // end
      } else {
        this.currentStep += 1;
      }
    },
    previous(content?: any): void {
      if (content) {
        if (this.formContent[this.currentStep]) {
          this.formContent[this.currentStep] = content;
        } else {
          this.formContent.push(content);
        }
      }
      if (this.currentStep > 0) {
        this.currentStep -= 1;
      }
    },
    getPreviousContent(): any {
      if (this.currentStep === 0) {
        return undefined;
      }
      return this.formContent[this.currentStep - 1];
    },
    getNextContent(): any {
      if (this.currentStep + 1 > this.totalSteps) {
        return undefined;
      }
      return this.formContent[this.currentStep + 1];
    },
  },
});
