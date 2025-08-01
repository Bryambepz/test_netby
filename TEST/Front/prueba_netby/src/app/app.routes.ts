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
                // redirectTo: 'productos-ver',
                children: 
                [
                    {
                        path: 'productos-crear',
                        loadComponent: () => import('./dashboard/pages/producto/crear-producto/crear-producto.component').then(t => t.CrearProductoComponent),
                    },
                    {
                        path: 'productos-crear/:id',
                        loadComponent: () => import('./dashboard/pages/producto/crear-producto/crear-producto.component').then(t => t.CrearProductoComponent),
                    },
                    {
                        path: 'productos-ver',
                        loadComponent: () => import('./dashboard/pages/producto/ver-producto/ver-producto.component').then(t => t.VerProductoComponent),
                    },
                    {
                        path: 'productos-categorias',
                        loadComponent: () => import('./dashboard/pages/producto/categoria-producto/categoria-producto.component').then(t => t.CategoriaProductoComponent),
                    },
                ],
            },
            {
                path: 'transaccion',
                // loadComponent: () => import('./dashboard/pages/transaccion/transaccion.component').then(t => t.TransaccionComponent),
                children: [
                    {
                        path: 'transaccion-crear',
                        loadComponent: () => import('./dashboard/pages/transaccion/crear-transaccion/crear-transaccion.component').then(t => t.CrearTransaccionComponent),
                    },
                    {
                        path: 'transaccion-crear/:id',
                        loadComponent: () => import('./dashboard/pages/transaccion/crear-transaccion/crear-transaccion.component').then(t => t.CrearTransaccionComponent),
                    },
                    {
                        path: 'transaccion-ver',
                        loadComponent: () => import('./dashboard/pages/transaccion/ver-transaccion/ver-transaccion.component').then(t => t.VerTransaccionComponent),
                    },
                ]
            },
        ]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    }
];
