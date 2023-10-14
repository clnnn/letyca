import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewConnection } from '@letyca/contracts';
import { TuiDialogContext, TuiPrimitiveTextfieldModule } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiButtonModule } from '@taiga-ui/core/components/button';
import { TuiInputModule, TuiInputNumberModule, TuiInputPasswordModule } from '@taiga-ui/kit';

@Component({
    selector: 'le-create-edit-connection-dialog-content',
    templateUrl: './create-edit-connection-dialog-content.component.html',
    styleUrls: ['./create-edit-connection-dialog-content.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TuiInputModule,
        TuiPrimitiveTextfieldModule,
        TuiInputNumberModule,
        TuiInputPasswordModule,
        TuiButtonModule,
    ],
})
export class CreateEditConnectionDialogContentComponent {
  formGroup = this.fb.nonNullable.group({
    host: this.fb.control<string | null>(null, Validators.required),
    port: this.fb.control<number | null>(null, Validators.required),
    database: this.fb.control<string | null>(null, Validators.required),
    schema: this.fb.control<string | null>(null, Validators.required),
    username: this.fb.control<string | null>(null, Validators.required),
    password: this.fb.control<string | null>(null, Validators.required),
  });

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private context: TuiDialogContext<NewConnection | null, NewConnection>,
    private fb: FormBuilder
  ) {}

  cancel(): void {
    this.context.completeWith(null);
  }

  submit(): void {
    const controls = this.formGroup.controls;
    this.context.completeWith({
      host: controls.host.value ?? '',
      port: controls.port.value ?? 0,
      database: controls.database.value ?? '',
      schema: controls.schema.value ?? '',
      username: controls.username.value ?? '',
      password: controls.password.value ?? '',
    });
  }
}
