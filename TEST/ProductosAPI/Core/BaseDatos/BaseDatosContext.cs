using System;
using System.Collections.Generic;
using Core.Entidades;
using Microsoft.EntityFrameworkCore;

namespace Core.BaseDatos;

public partial class BaseDatosContext : DbContext
{
    public BaseDatosContext()
    {
    }

    public BaseDatosContext(DbContextOptions<BaseDatosContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Categoria> Categoria { get; set; }

    public virtual DbSet<Productos> Productos { get; set; }

    public virtual DbSet<Rol> Rol { get; set; }

    public virtual DbSet<TipoTransaccion> TipoTransaccion { get; set; }

    public virtual DbSet<Transacciones> Transacciones { get; set; }

    public virtual DbSet<Usuario> Usuario { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.ToTable("CATEGORIA", "PRODUCTO");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Estado).HasColumnName("ESTADO");
            entity.Property(e => e.Nombre)
                .HasMaxLength(250)
                .UseCollation("Latin1_General_CI_AS")
                .HasColumnName("NOMBRE");
        });

        modelBuilder.Entity<Productos>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_PRODUCTO");

            entity.ToTable("PRODUCTOS", "PRODUCTO");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CategoriaId).HasColumnName("CATEGORIA_ID");
            entity.Property(e => e.Nombre)
                .HasMaxLength(250)
                .UseCollation("Latin1_General_CI_AS")
                .HasColumnName("NOMBRE");

            entity.HasOne(d => d.Categoria).WithMany(p => p.Productos)
                .HasForeignKey(d => d.CategoriaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PRODUCTO_CATEGORIA");
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.ToTable("ROL", "SUJETO");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Estado).HasColumnName("ESTADO");
        });

        modelBuilder.Entity<TipoTransaccion>(entity =>
        {
            entity.ToTable("TIPO_TRANSACCION", "TRANSACCION");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Estado).HasColumnName("ESTADO");
        });

        modelBuilder.Entity<Transacciones>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_TRANSACCION");

            entity.ToTable("TRANSACCIONES", "TRANSACCION");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Cantidad).HasColumnName("CANTIDAD");
            entity.Property(e => e.Detalle)
                .HasMaxLength(500)
                .UseCollation("Latin1_General_CI_AS")
                .HasColumnName("DETALLE");
            entity.Property(e => e.Fecha).HasColumnName("FECHA");
            entity.Property(e => e.PrecioTotal)
                .HasColumnType("decimal(6, 4)")
                .HasColumnName("PRECIO_TOTAL");
            entity.Property(e => e.PrecioUnitario)
                .HasColumnType("decimal(6, 4)")
                .HasColumnName("PRECIO_UNITARIO");
            entity.Property(e => e.ProductoId).HasColumnName("PRODUCTO_ID");
            entity.Property(e => e.TipoTransaccionId).HasColumnName("TIPO_TRANSACCION_ID");
            entity.Property(e => e.UsuarioId).HasColumnName("USUARIO_ID");

            entity.HasOne(d => d.Producto).WithMany(p => p.Transacciones)
                .HasForeignKey(d => d.ProductoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TRANSACCION_PRODUCTO");

            entity.HasOne(d => d.TipoTransaccion).WithMany(p => p.Transacciones)
                .HasForeignKey(d => d.TipoTransaccionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TRANSACCION_TIPO_TRANS");

            entity.HasOne(d => d.Usuario).WithMany(p => p.Transacciones)
                .HasForeignKey(d => d.UsuarioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TRANSACCION_USUARIO");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("USUARIO", "SUJETO");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Clave)
                .HasMaxLength(250)
                .UseCollation("Latin1_General_CI_AS")
                .HasColumnName("CLAVE");
            entity.Property(e => e.Estado).HasColumnName("ESTADO");
            entity.Property(e => e.Nombre)
                .HasMaxLength(250)
                .UseCollation("Latin1_General_CI_AS")
                .HasColumnName("NOMBRE");
            entity.Property(e => e.RolId).HasColumnName("ROL_ID");
            entity.Property(e => e.Usuario1)
                .HasMaxLength(250)
                .UseCollation("Latin1_General_CI_AS")
                .HasColumnName("USUARIO");

            entity.HasOne(d => d.Rol).WithMany(p => p.Usuario)
                .HasForeignKey(d => d.RolId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USUARIO_ROL");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
