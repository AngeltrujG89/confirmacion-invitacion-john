// services/confirmacion.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmacionService {
  constructor(private firestore: Firestore) { }

  async guardarConfirmacion(confirmacion: any): Promise<string | false> {
    try {
      // ✅ Solo estos campos son requeridos
      const camposRequeridos = ['nombre', 'telefono', 'mariscos'];

      for (const campo of camposRequeridos) {
        if (!confirmacion[campo] || confirmacion[campo].toString().trim() === '') {
          throw new Error(`Campo requerido faltante: ${campo}`);
        }
      }

      // ✅ Permitir campos opcionales vacíos (no causan error)
      const confirmacionesRef = collection(this.firestore, 'confirmacion-invitados');
      const docRef = await addDoc(confirmacionesRef, {
        ...confirmacion,
        fecha: new Date(),
        timestamp: Date.now()
      });

      console.log('✅ Confirmación guardada con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error guardando confirmación:', error);
      return false;
    }
  }

  obtenerConfirmaciones(): Observable<any[]> {
    const confirmacionesRef = collection(this.firestore, 'confirmacion-invitados');
    return collectionData(confirmacionesRef, { idField: 'id' }) as Observable<any[]>;
  }
}