import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // Agregar OnInit
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmacionService } from '../confirmacion-service';

export type TipoInvitacion = 'individual' | 'pareja' | 'indefinido';

// Mapa de códigos a tipos de invitación
const CODIGOS_INVITACION: { [key: string]: TipoInvitacion } = {
	'j8': 'individual',    // Código para individual
	'k5': 'pareja',        // Código para pareja
	'x3': 'individual',    // Otro código para individual
	'm9': 'pareja'         // Otro código para pareja
};

@Component({
	selector: 'app-formulario-registro',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './formulario-registro.component.html',
	styleUrl: './formulario-registro.component.scss'
})
export class FormularioRegistroComponent implements OnInit { // Implementar OnInit

	form!: FormGroup;
	mostrarFormulario = false;
	mostrarAgradecimiento = false;
	tipoInvitacion: TipoInvitacion = 'indefinido';
	codigoInvitacion: string = '';

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private confirmacionService: ConfirmacionService
	) { }

	ngOnInit(): void {
		this.buildForm();
		this.route.queryParams.subscribe(params => {
			const codigo = params['codigo'];
			console.log('Código recibido:', codigo); // Debug

			if (codigo && this.validarCodigo(codigo)) {
				this.codigoInvitacion = codigo;
				this.tipoInvitacion = CODIGOS_INVITACION[codigo];
				console.log('Tipo de invitación:', this.tipoInvitacion); // Debug

				// Guardar el código en el formulario
				this.form.patchValue({ codigoInvitacion: codigo });

				// Configurar validaciones según el tipo
				this.configurarValidaciones();

				// Opcional: limpiar URL después de leer el parámetro
				//this.limpiarURL();
			} else {
				this.tipoInvitacion = 'indefinido';
				this.codigoInvitacion = '';
				console.log('Código inválido o no proporcionado'); // Debug
			}
		});

		this.configurarListeners();
	}


	buildForm() {
		this.form = this.formBuilder.group({
			nombre: ['', [Validators.required]],
			telefono: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
			mariscos: ['', [Validators.required]],
			asistira: [''], // Para individual
			asistenciaAcompanante: [''], // Para pareja - CORREGIDO el nombre
			dosDias: [''],
			codigoInvitacion: ['']
		});
	}

	async enviarFormulario() {
		console.log('Formulario enviado', this.form.value);
		console.log('Formulario válido', this.form.valid);

		if (this.form.valid) {
			// COMENTA temporalmente la parte de Firebase:

			const exito = await this.confirmacionService.guardarConfirmacion({
				...this.form.value,
				tipoInvitacion: this.tipoInvitacion,
				codigo: this.codigoInvitacion
			});

			if (exito) {
				this.mostrarAgradecimiento = true;
				this.mostrarFormulario = false;
			} else {
				alert('Error al enviar la confirmación. Por favor intenta nuevamente.');
			}


			// SOLO muestra el agradecimiento por ahora
			this.mostrarAgradecimiento = true;
			this.mostrarFormulario = false;
		} else {
			// Marcar todos los campos como touched para mostrar errores
			Object.keys(this.form.controls).forEach(key => {
				const control = this.form.get(key);
				if (control?.invalid) {
					control.markAsTouched();
				}
			});
		}
	}

	private validarCodigo(codigo: string): boolean {
		const valido = CODIGOS_INVITACION.hasOwnProperty(codigo);
		console.log('¿Código válido?', codigo, valido); // Debug
		return valido;
	}

	private configurarValidaciones() {
		const asistiraControl = this.form.get('asistira');
		const asistenciaAcompananteControl = this.form.get('asistenciaAcompanante'); // CORREGIDO

		console.log('Configurando validaciones para:', this.tipoInvitacion); // Debug

		if (this.tipoInvitacion === 'pareja') {
			// Para pareja: requerir asistenciaAcompanante, opcional asistira
			asistenciaAcompananteControl?.setValidators([Validators.required]);
			asistiraControl?.clearValidators();
		} else {
			// Para individual: requerir asistira, opcional asistenciaAcompanante
			asistiraControl?.setValidators([Validators.required]);
			asistenciaAcompananteControl?.clearValidators();
		}

		asistiraControl?.updateValueAndValidity();
		asistenciaAcompananteControl?.updateValueAndValidity();

		console.log('Estado controles - asistira:', asistiraControl?.valid);
		console.log('Estado controles - acompañante:', asistenciaAcompananteControl?.valid);
	}

	private limpiarURL() {
		this.router.navigate([], {
			queryParams: { codigo: null },
			queryParamsHandling: 'merge',
			replaceUrl: true
		});
	}

	mostrarForm(): void {
		this.mostrarFormulario = true;
	}

	// Para debug - ver el estado actual
	getEstadoDebug(): string {
		return `Tipo: ${this.tipoInvitacion}, Código: ${this.codigoInvitacion}, FormVisible: ${this.mostrarFormulario}`;
	}

	getTextoInvitacion(): string {
		switch (this.tipoInvitacion) {
			case 'individual':
				return 'Invitación Individual';
			case 'pareja':
				return 'Invitación para Pareja';
			default:
				return 'Confirmar Asistencia';
		}
	}

	getSubtituloInvitacion(): string {
		switch (this.tipoInvitacion) {
			case 'individual':
				return 'Confirmación para 1 persona';
			case 'pareja':
				return 'Confirmación para 2 personas';
			default:
				return 'Por favor confirma tu asistencia';
		}
	}

	esCodigoValido(): boolean {
		return this.tipoInvitacion !== 'indefinido';
	}

	configurarListeners(): void {
		// 🔹 Escucha cambios en "asistira"
		this.form.get('asistira')?.valueChanges.subscribe((valor) => {
			if (this.tipoInvitacion === 'individual') {
				this.actualizarValidacionDosDias(valor);
			}
		});

		// 🔹 Escucha cambios en "asistenciaAcompanante"
		this.form.get('asistenciaAcompanante')?.valueChanges.subscribe((valor) => {
			if (this.tipoInvitacion === 'pareja') {
				this.actualizarValidacionDosDias(valor);
			}
		});
	}

	actualizarValidacionDosDias(valor: string): void {
		const controlDosDias = this.form.get('dosDias');

		if (valor !== 'no') {
			// 🔹 Si el valor NO es "no", reset y vuelve obligatorio
			controlDosDias?.reset();
			controlDosDias?.setValidators([Validators.required]);
			controlDosDias?.updateValueAndValidity();
		} else {
			// 🔹 Si el valor ES "no", limpiar y quitar validación
			controlDosDias?.reset();
			controlDosDias?.clearValidators();
			controlDosDias?.updateValueAndValidity();
		}
	}
}