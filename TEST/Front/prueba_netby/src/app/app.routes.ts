import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(t => t.DashboardComponent),
        children: [
            {
                path: 'home',
                loadComponent: () => import('./dashboard/pages/home/home.component').then(t => t.HomeComponent),
            },
            {
                path: 'producto',
                loadComponent: () => import('./dashboard/pages/producto/producto.component').then(t => t.ProductoComponent),
            },
            {
                path: 'transaccion',
                loadComponent: () => import('./dashboard/pages/transaccion/transaccion.component').then(t => t.TransaccionComponent),
            },
        ]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    }
];
