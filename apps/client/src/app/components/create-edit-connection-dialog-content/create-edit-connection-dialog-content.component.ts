import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiButton } from '@taiga-ui/core';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputPasswordModule,
  TuiPrimitiveTextfieldModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';

import { NewConnection } from '../../state';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';

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
    TuiTextfieldControllerModule,
    TuiInputNumberModule,
    TuiInputPasswordModule,
    TuiButton,
  ],
})
export class CreateEditConnectionDialogContentComponent {
  private readonly context =
    inject<TuiDialogContext<NewConnection | null, NewConnection | null>>(
      POLYMORPHEUS_CONTEXT,
    );
  private readonly fb = inject(FormBuilder);

  formGroup = this.fb.nonNullable.group({
    host: this.fb.control<string | null>(null, Validators.required),
    port: this.fb.control<number | null>(null, Validators.required),
    database: this.fb.control<string | null>(null, Validators.required),
    schema: this.fb.control<string | null>(null, Validators.required),
    username: this.fb.control<string | null>(null, Validators.required),
    password: this.fb.control<string | null>(null, Validators.required),
  });

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
